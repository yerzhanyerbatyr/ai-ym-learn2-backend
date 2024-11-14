import User, { IUser, ILesson, ITask, ICourse } from '../models/userModel';
import CourseService from './courseService';
import { getLessonById } from './lessonService';
import { getTaskById } from './taskService';
import LLMService from '../llm/llmService';

export const createUser = async (userData: IUser) => {
  // Check if a user with the given userId already exists
  const existingUser = await User.findOne({ userId: userData.userId });
  if (existingUser) {
    throw new Error(`User with userId ${userData.userId} already exists`);
  }

  // Create a new user if no existing user is found
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (userId: string) => {
  return await User.findOne({ userId });
};

export const updateUser = async (userId: string, updateData: Partial<IUser>) => {
  return await User.findOneAndUpdate({ userId }, updateData, { new: true });
};

export const deleteUser = async (userId: string) => {
  return await User.findOneAndDelete({ userId });
};

export const getUserCourses = async (userId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  return user?.userCourses || [];
};

export const getUserCompletedLessonIds = async (userId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  if (!user) throw new Error('User not found');

  // Extract only the `lessonId` of completed lessons
  const completedLessonIds = user.userCourses.flatMap((course) =>
    course.courseLessons.filter((lesson) => lesson.status === 'complete').map((lesson) => lesson.lessonId)
  );

  return completedLessonIds;
};

export const getInProgressLessonId = async (userId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  if (!user) throw new Error('User not found');

  // Find the course that is in progress
  const inProgressCourse = user.userCourses.find((course) => course.status === 'in progress');
  if (!inProgressCourse) throw new Error('No course in progress found');

  // Find the first in-progress lesson in this course
  const inProgressLesson = inProgressCourse.courseLessons.find((lesson) => lesson.status === 'in progress');
  if (!inProgressLesson) throw new Error('No in-progress lesson found');

  return inProgressLesson.lessonId;
};


export const getLessonTasksById = async (userId: string, lessonId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  if (!user) throw new Error('User not found');

  // Find the lesson by lessonId and return its tasks
  for (const course of user.userCourses) {
    const lesson = course.courseLessons.find((lesson) => lesson.lessonId === lessonId);
    if (lesson) {
      return lesson.lessonTasks;
    }
  }

  throw new Error('Lesson not found');
};

export const startCourse = async (userId: string, courseId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');
  console.log("I got here")
  // Check if the course already exists in userCourses
  let course = user.userCourses.find((course: ICourse) => course.courseId.toString() === courseId);
  console.log("I got the course")
  console.log(course)

  if (course) {
    // Check if there is already a lesson in progress

    const inProgressLesson = course.courseLessons.find((lesson) => lesson.status === 'in progress');
    if (inProgressLesson) {
      // If a lesson is already in progress, do nothing
      return;
    }

    // Find the next lesson after the last completed one
    const nextLesson = course.courseLessons.find((lesson, index, lessons) =>
      lesson.status === 'incomplete' &&
      (index === 0 || lessons[index - 1].status === 'complete')
    );

    console.log(nextLesson)

    if (!nextLesson) throw new Error('No more lessons to start in this course');

    // Set the next lesson status to 'in progress'
    nextLesson.status = 'in progress';
    const lesson = await getLessonById(courseId, nextLesson.lessonId);
    const fetchedTasks = lesson.tasks;
    nextLesson.lessonTasks = fetchedTasks.map((task) => ({
      taskId: task._id.toString(),
      status: 'incomplete',
      videoUrl: null,
      completedAt: null,
    }));
    
  } else {
    console.log("Here in the else")
    // Initialize the course if it does not exist
    const courseData = await CourseService.getCourseById(courseId);
    console.log("Here is the courseData")
    console.log(courseData)
    if (!courseData) throw new Error('Course not found');

    // Map all lessons with status 'not started'
    const courseLessons: ILesson[] = courseData.lessons.map((lesson) => ({
      lessonId: lesson._id.toString(),
      status: 'incomplete',
      completedAt: null,
      lessonTasks: [],
    }));

    // Set the first lesson status to 'in progress' and fetch its tasks
    courseLessons[0].status = 'in progress';
    console.log(courseLessons[0]);
    console.log(courseLessons[0].lessonId);
    const lesson = await getLessonById(courseId, courseLessons[0].lessonId);
    const fetchedTasks = lesson.tasks;
    courseLessons[0].lessonTasks = fetchedTasks.map((task) => ({
      taskId: task._id.toString(),
      status: 'incomplete',
      videoUrl: null,
      completedAt: null,
    }));

    console.log(courseLessons[0].lessonTasks)
    // Add the new course to userCourses
    course = {
      courseId,
      status: 'in progress',
      completedAt: null,
      courseLessons,
    };
    console.log("Im pushing this:")
    console.log(course.courseLessons[0].lessonTasks)
    user.userCourses.push(course);
    console.log("pushed")
  }

  // Save the user with the updated course data
  await user.save();
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const updateStreak = async (user: any) => {
  console.log("started updating the streak")
  const today = new Date();
  const lastActive = user.lastActiveDay ? new Date(user.lastActiveDay) : null;

  today.setHours(0, 0, 0, 0);
  if (lastActive) lastActive.setHours(0, 0, 0, 0);
  console.log(today)
  console.log(lastActive)

  if (lastActive && today.getTime() === lastActive.getTime()) {
    console.log("the same day")
    return;
  }
  console.log(lastActive)

  if (lastActive) {
    const dayDifference = Math.floor((today.getTime() - lastActive.getTime()) / ONE_DAY_MS);
    console.log(dayDifference)
    if (dayDifference === 1) {
      user.streakCount += 1;
    } else {
      user.streakCount = 1;
    }
  } else {
    user.streakCount = 1;
  }

  user.lastActiveDay = today;
  await user.save();
};

export const startTask = async (userId: string, courseId: string, lessonId: string, taskId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const course = user.userCourses.find((course) => course.courseId === courseId);
  if (!course) throw new Error('Course not found');

  const lesson = course.courseLessons.find((lesson) => lesson.lessonId === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const task = lesson.lessonTasks.find((task) => task.taskId === taskId);
  if (!task) throw new Error('Task not found');

  if (task.status === 'complete') {
    return;
  }

  task.status = 'in progress';
  await user.save();
};

export const completeTask = async (userId: string, courseId: string, lessonId: string, taskId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const course = user.userCourses.find((course) => course.courseId === courseId);
  if (!course) throw new Error('Course not found');

  const lesson = course.courseLessons.find((lesson) => lesson.lessonId === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const task = lesson.lessonTasks.find((task) => task.taskId === taskId);
  if (!task) throw new Error('Task not found');

  if (task.status !== 'complete') {
    const taskData = await getTaskById(courseId, lessonId, taskId);
    user.totalXp += taskData.xpValue;
  }

  task.status = 'complete';
  task.completedAt = new Date();

  await updateStreak(user);

  await user.save();
};

export const completeLesson = async (userId: string, courseId: string, lessonId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const course = user.userCourses.find((course) => course.courseId === courseId);
  if (!course) throw new Error('Course not found');

  const lesson = course.courseLessons.find((lesson) => lesson.lessonId === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  // Check if all tasks are complete
  const allTasksComplete = lesson.lessonTasks.every((task) => task.status === 'complete');
  if (!allTasksComplete) throw new Error('Not all tasks are complete');

  lesson.status = 'complete';
  lesson.completedAt = new Date();

  const lastLesson = course.courseLessons[course.courseLessons.length - 1];
  if (lastLesson.lessonId === lessonId) {
    console.log("Last lesson completed, marking the course as complete");
    await completeCourse(userId, courseId);
  }

  await user.save();
};

export const completeCourse = async (userId: string, courseId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const course = user.userCourses.find((course) => course.courseId === courseId);
  if (!course) throw new Error('Course not found');

  // Check if all lessons are complete
  const allLessonsComplete = course.courseLessons.every((lesson) => lesson.status === 'complete');
  if (!allLessonsComplete) throw new Error('Not all lessons are complete');

  course.status = 'complete';
  course.completedAt = new Date();

  await user.save();
};

export const generateQuiz = async (userId: string, courseId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');
  const llmService = new LLMService();
  
  // Generate quiz using your existing AI function
  const generatedQuiz = await llmService.generateQuiz(courseId);
  console.log(generatedQuiz)
  const quizData = JSON.parse(generatedQuiz);
  console.log(quizData)

  // Initialize exercises with 'incomplete' status
  const exercises = quizData.quiz.map((exercise: any) => ({
    status: 'incomplete',
    description: exercise.description,
    answerOptions: exercise.answerOptions,
    correctAnswer: exercise.correctAnswer,
    xpValue: 75,
  }));

  // Create the new quiz
  const quiz = {
    exercises,
    score: null,
    completedAt: null,
  };

  // Add the quiz to the user's quizzes
  user.userQuizzes.push(quiz);
  await user.save();
};

export const getUserQuizzes = async (userId: string) => {
  const user = await User.findOne({ userId }).select('userQuizzes');
  return user?.userQuizzes || [];
};

export const getQuizById = async (userId: string, quizId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const quiz = user.userQuizzes.id(quizId);
  if (!quiz) throw new Error('Quiz not found');

  return quiz.exercises;
};

export const startExercise = async (userId: string, quizId: string, exerciseId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const quiz = user.userQuizzes.id(quizId);
  if (!quiz) throw new Error('Quiz not found');

  const exercise = quiz.exercises.id(exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  // Change status to 'in progress'
  if (exercise.status === 'complete') throw new Error('Exercise already completed');
  exercise.status = 'in progress';

  await user.save();
};

export const completeExercise = async (userId: string, quizId: string, exerciseId: string, userAnswer: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const quiz = user.userQuizzes.id(quizId);
  if (!quiz) throw new Error('Quiz not found');

  const exercise = quiz.exercises.id(exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  // Check if the exercise is already complete
  if (exercise.status === 'pass') throw new Error('Exercise already completed');

  // Check user answer
  if (userAnswer === exercise.correctAnswer) {
    if (exercise.status !== 'pass') {
      exercise.status = 'pass';
      user.totalXp += exercise.xpValue;
    }
  } else {
    exercise.status = 'fail';
  }

  // Update streak and last active day
  await updateStreak(user);
  exercise.completedAt = new Date();

  await user.save();
};

export const completeQuiz = async (userId: string, quizId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const quiz = user.userQuizzes.id(quizId);
  if (!quiz) throw new Error('Quiz not found');

  // Check if all exercises are completed
  const allCompleted = quiz.exercises.every((exercise) => exercise.status === 'pass' || exercise.status === 'fail');
  if (!allCompleted) throw new Error('Not all exercises are completed');

  // Calculate score: percentage of exercises that passed
  const passedExercises = quiz.exercises.filter((exercise) => exercise.status === 'pass').length;
  const totalExercises = quiz.exercises.length;
  quiz.score = Math.round((passedExercises / totalExercises) * 100);
  quiz.completedAt = new Date();

  await user.save();
};
