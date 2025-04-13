import User, { IUser, ILesson, ITask, ICourse } from '../models/userModel';
import CourseService from './courseService';
import { getLessonById } from './lessonService';
import { getTaskById } from './taskService';

export const createUser = async (userData: IUser) => {
  const existingUser = await User.findOne({ userId: userData.userId });
  if (existingUser) {
    throw new Error(`User with userId ${userData.userId} already exists`);
  }

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

  const completedLessonIds = user.userCourses.flatMap((course) =>
    course.courseLessons.filter((lesson) => lesson.status === 'complete').map((lesson) => lesson.lessonId)
  );

  return completedLessonIds;
};

export const getInProgressLessonId = async (userId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  if (!user) throw new Error('User not found');

  const inProgressCourse = user.userCourses.find((course) => course.status === 'in progress');
  if (!inProgressCourse) throw new Error('No course in progress found');

  const inProgressLesson = inProgressCourse.courseLessons.find((lesson) => lesson.status === 'in progress');
  if (!inProgressLesson) throw new Error('No in-progress lesson found');

  return inProgressLesson.lessonId;
};


export const getLessonTasksById = async (userId: string, lessonId: string) => {
  const user = await User.findOne({ userId }).select('userCourses');
  if (!user) throw new Error('User not found');

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

  let course = user.userCourses.find((course: ICourse) => course.courseId.toString() === courseId);

  if (course) {

    const inProgressLesson = course.courseLessons.find((lesson) => lesson.status === 'in progress');
    if (inProgressLesson) {
      return;
    }

    const nextLesson = course.courseLessons.find((lesson, index, lessons) =>
      lesson.status === 'incomplete' &&
      (index === 0 || lessons[index - 1].status === 'complete')
    );

    if (!nextLesson) throw new Error('No more lessons to start in this course');

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
    const courseData = await CourseService.getCourseById(courseId);

    if (!courseData) throw new Error('Course not found');

    const courseTitle = courseData.title;

    console.log("courseTitle", courseTitle)

    const courseLessons: ILesson[] = courseData.lessons.map((lesson) => ({
      lessonId: lesson._id.toString(),
      status: 'incomplete',
      completedAt: null,
      lessonTasks: [],
    }));

    courseLessons[0].status = 'in progress';

    const lesson = await getLessonById(courseId, courseLessons[0].lessonId);
    const fetchedTasks = lesson.tasks;

    courseLessons[0].lessonTasks = fetchedTasks.map((task) => ({
      taskId: task._id.toString(),
      status: 'incomplete',
      videoUrl: null,
      completedAt: null,
    }));

    const originalQuiz = courseData.quiz?.[0];

    const courseQuiz = originalQuiz
      ? {
          quizId: originalQuiz._id.toString(),
          title: originalQuiz.title,
          score: 0,
          completedAt: null,
          exercises: originalQuiz.exercises.map((exer) => ({
            status: 'incomplete',
            userChoice: null,
            xpValue: exer.xpValue,
            exerciseId: exer._id.toString(),
          })),
        }
      : null;

      course = {
        courseId,
        courseTitle,
        status: 'in progress',
        completedAt: null,
        courseLessons,
        courseQuiz,
      };
    
    user.userCourses.push(course);
  }

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

export const completeTask = async (userId: string, courseId: string, lessonId: string, taskId: string, status: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const course = user.userCourses.find((course) => course.courseId === courseId);
  if (!course) throw new Error('Course not found');

  const lesson = course.courseLessons.find((lesson) => lesson.lessonId === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const task = lesson.lessonTasks.find((task) => task.taskId === taskId);
  if (!task) throw new Error('Task not found');

  if (task.status !== 'complete' && status === 'pass') {
    task.status = 'pass';
    task.completedAt = new Date();
    const taskData = await getTaskById(courseId, lessonId, taskId);
    user.totalXp += taskData.xpValue;
  } else if (task.status !== 'complete' && status === 'fail') {
    task.status = 'fail';
  }
  else if (task.status === 'pass') {
    throw new Error('Task already passed');
  }

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

  const allLessonsComplete = course.courseLessons.every((lesson) => lesson.status === 'complete');
  if (!allLessonsComplete) throw new Error('Not all lessons are complete');

  course.status = 'complete';
  course.completedAt = new Date();

  await user.save();
};

export const getUserQuizzes = async (userId: string) => {
  const user = await User.findOne({ userId });
  if (!user) return [];

  const quizzes = user.userCourses
    .map((course: any) => course.courseQuiz) 
    .filter((quiz) => quiz !== null); 

  return quizzes;
};

export const getUserQuizzesByCourseId = async (userId: string, courseId: string) => {
  const user = await User.findOne({ userId });

  if (!user) return null;

  const course = user.userCourses.find((c: any) => c.courseId === courseId);

  return course?.courseQuiz || null;
};

export const completeExercise = async (userId: string, courseId, quizId: string, exerciseId: string, userChoice, status) => {
  
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const userCourse = user.userCourses.find(course => course.courseId === courseId);
  if (!userCourse) throw new Error('User course not found');

  const quiz = userCourse.courseQuiz;
  if (!quiz) throw new Error('Quiz not found');

  const exercise = quiz.exercises.find(ex => ex.exerciseId.toString() === exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  if (exercise.status === 'pass') throw new Error('Exercise already completed');

  if (exercise.status !== 'complete' && status === 'pass') {
    exercise.status = 'pass';
    exercise.completedAt = new Date();
    exercise.userChoice = userChoice;
    user.totalXp += exercise.xpValue;
  } else if (exercise.status !== 'complete' && status === 'fail') {
    exercise.status = 'fail';
    exercise.userChoice = userChoice;
  }
  else if (exercise.status === 'pass') {
    throw new Error('exercise already passed');
  }
  
  const allExercisesCompleted = quiz.exercises.every((ex) => ex.status === 'pass' || ex.status === 'fail');
  console.log("allExercisesCompleted", allExercisesCompleted)
  if (allExercisesCompleted) {
    await completeQuiz(userId, quizId, courseId);
  }

  await updateStreak(user);

  await user.save();
};

export const completeQuiz = async (userId: string, quizId: string, courseId) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const userCourse = user.userCourses.find(course => course.courseId === courseId);
  if (!userCourse) throw new Error('User course not found');

  const quiz = userCourse.courseQuiz;
  if (!quiz) throw new Error('Quiz not found');

  const totalXpValue = quiz.exercises.reduce((sum, exercise) => sum + exercise.xpValue, 0);
  const passedXpValue = quiz.exercises
    .filter((exercise) => exercise.status === 'pass')
    .reduce((sum, exercise) => sum + exercise.xpValue, 0);

  const score = totalXpValue > 0 ? Math.round((passedXpValue / totalXpValue) * 100) : 0;
  quiz.score = score;
  quiz.completedAt = new Date();

  await user.save();
};
