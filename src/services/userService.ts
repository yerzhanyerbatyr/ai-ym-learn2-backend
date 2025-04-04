import User, { IUser, ILesson, ITask, ICourse } from '../models/userModel';
import CourseService from './courseService';
import { getLessonById } from './lessonService';
import { getTaskById } from './taskService';

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

  // Check if the course already exists in userCourses
  let course = user.userCourses.find((course: ICourse) => course.courseId.toString() === courseId);

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
    // Initialize the course if it does not exist
    const courseData = await CourseService.getCourseById(courseId);

    if (!courseData) throw new Error('Course not found');

    const courseTitle = courseData.title;

    console.log("courseTitle", courseTitle)

    // Map all lessons with status 'not started'
    const courseLessons: ILesson[] = courseData.lessons.map((lesson) => ({
      lessonId: lesson._id.toString(),
      status: 'incomplete',
      completedAt: null,
      lessonTasks: [],
    }));

    // Set the first lesson status to 'in progress' and fetch its tasks
    courseLessons[0].status = 'in progress';

    const lesson = await getLessonById(courseId, courseLessons[0].lessonId);
    const fetchedTasks = lesson.tasks;

    courseLessons[0].lessonTasks = fetchedTasks.map((task) => ({
      taskId: task._id.toString(),
      status: 'incomplete',
      videoUrl: null,
      completedAt: null,
    }));

    // Add the new course to userCourses
    course = {
      courseId,
      courseTitle,
      status: 'in progress',
      completedAt: null,
      courseLessons,
    };
    
    user.userCourses.push(course);
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

// export const generateQuiz = async (courseId: string) => {
//   // const user = await User.findOne({ userId });
//   // if (!user) throw new Error('User not found');

//   const courseData = await CourseService.getCourseById(courseId);

//   if (!courseData) throw new Error('Course not found');

//   console.log(courseData);
  
//   // Generate quiz using your existing AI function
//   const generatedQuiz = await llmService.generateQuiz(courseId);
//   const quizData = JSON.parse(generatedQuiz);
//   console.log("quiz generated")

//   // const courseData = await CourseService.getCourseById(courseId);

//   // if (!courseData) throw new Error('Course not found');

//   // console.log(courseData);

//   const quizTitle = courseData.title;

//   console.log("quizTitle", quizTitle)

//   // Initialize exercises with 'incomplete' status
//   const exercises = quizData.quiz.map((exercise: any) => ({
//     status: 'incomplete',
//     description: exercise.description,
//     type: exercise.type,
//     words: exercise.words,
//     videoUrls: exercise.videoUrls,
//     correctAnswer: exercise.correctAnswer,
//     userChoice: null,
//     xpValue: exercise.xpValue,
//   }));

//   // Create the new quiz
//   const quiz = {
//     title: quizTitle,
//     exercises,
//     score: null,
//     completedAt: null,
//   };

//   // Add the quiz to the user's quizzes
//   courseData.quiz.push(quiz);
//   await courseData.save();
//   console.log("Finished");
// };

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
  if (exercise.status === 'pass') throw new Error('Exercise already completed');
  exercise.status = 'in progress';

  await user.save();
};

export const completeExercise = async (userId: string, quizId: string, exerciseId: string, userChoice: string | Array<{ word: string; videoUrl: string }> | { word: string; videoUrl: string }) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const quiz = user.userQuizzes.id(quizId);
  if (!quiz) throw new Error('Quiz not found');

  const exercise = quiz.exercises.id(exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  const correctAnswer = exercise.correctAnswer;

  if (exercise.status === 'pass') throw new Error('Exercise already completed');

  if (correctAnswer === userChoice) {
    if (exercise.status !== 'pass') {
      exercise.status = 'pass';
      user.totalXp += exercise.xpValue;
    }
  } else {
    exercise.status = 'fail';
  }

  await updateStreak(user);
  exercise.completedAt = new Date();
  exercise.userChoice = userChoice;
  await user.save();
  
  const allExercisesCompleted = quiz.exercises.every((ex) => ex.status === 'pass' || ex.status === 'fail');
  if (allExercisesCompleted) {
    await completeQuiz(userId, quizId);
  }

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
  const totalXpValue = quiz.exercises.reduce((sum, exercise) => sum + exercise.xpValue, 0);
  const passedXpValue = quiz.exercises
    .filter((exercise) => exercise.status === 'pass')
    .reduce((sum, exercise) => sum + exercise.xpValue, 0);

  // Avoid division by zero
  const score = totalXpValue > 0 ? Math.round((passedXpValue / totalXpValue) * 100) : 0;
  quiz.score = score;
  quiz.completedAt = new Date();

  await user.save();
};
