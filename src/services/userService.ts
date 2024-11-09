import User, { IUser, ICompletedLesson, ICompletedTask, ICompletedCourse } from '../models/userModel';
import {getLessonById} from '../services/lessonService';
import CourseService from '../services/courseService';

export const createUser = async (userData: IUser) => {
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

export const getUserCompletedCourses = async (userId: string) => {
  const user = await User.findOne({ userId }).select('completedCourses');
  return user?.completedCourses || [];
};

export const getUserTakenQuizzes = async (userId: string) => {
  const user = await User.findOne({ userId }).select('takenQuizzes');
  return user?.takenQuizzes || [];
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const updateStreak = async (user: any) => {
  const today = new Date();
  const lastActive = user.lastActiveDay ? new Date(user.lastActiveDay) : null;

  today.setHours(0, 0, 0, 0);
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  if (lastActive && today.getTime() === lastActive.getTime()) {
    // If dates are the same, skip updating the streak
    return;
  }

  if (lastActive) {
    const dayDifference = Math.floor((today.getTime() - lastActive.getTime()) / ONE_DAY_MS);
    if (dayDifference === 1) {
      user.streakCount += 1;
    } else if (dayDifference > 1) {
      user.streakCount = 1; // reset streak if more than 1 day has passed
    }
  } else {
    user.streakCount = 1; // initialize streak if none exists
  }

  user.lastActiveDay = today;
  return await user.save();
};

export const startCourse = async (userId: string, courseId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  let course = user.completedCourses.find((course: ICompletedCourse) => course.courseId === courseId);
  if (course){
    return course.completedLessons;
  } else {
      // Create a new lesson if it doesn't exist
      const courseData = await CourseService.getCourseById(courseId);
      if (!courseData) throw new Error('Course not found');
      const completedLessons: ICompletedLesson[] = courseData.lessons.map((lesson) => ({
        lessonId: lesson._id.toString(),
        status: 'not started',
        completedAt: null,
        completedTasks: lesson.tasks.map((task) => ({
          taskId: task._id.toString(),
          status: 'not started',
          videoUrl: task.videoUrl || '',
          completedAt: null,
        })),
      }));
      course = {
        courseId,
        status: 'in progress',
        completedAt: null,
        completedLessons,
      };
      user.completedCourses.push(course);
  }

  await user.save();
  return course.completedCourses;
};

export const startLesson = async (userId: string, lessonId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  let lesson = user.completedLessons.find((lesson: ICompletedLesson) => lesson.lessonId === lessonId);
  if (!lesson) {
      // Create a new lesson if it doesn't exist
      lesson = { lessonId, status: 'in progress', completedAt: null, completedTasks: [] };
      user.completedLessons.push(lesson);
  }

  await user.save();
  return lesson.completedTasks;
};

export const completeLesson = async (userId: string, lessonId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const lesson = user.completedLessons.find((lesson: ICompletedLesson) => lesson.lessonId === lessonId);
  if (lesson) {
      lesson.status = 'complete';
      lesson.completedAt = new Date();
      await user.save();
  }
  if (!lesson) throw new Error('Lesson not found');
};

export const startTask = async (userId: string, lessonId: string, taskId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  let lesson = user.completedLessons.find((lesson: ICompletedLesson) => lesson.lessonId === lessonId);
  if (!lesson) {
      lesson = { lessonId, status: 'in progress', completedAt: null, completedTasks: [] };
      user.completedLessons.push(lesson);
  }

  let task = lesson.completedTasks.find((task: ICompletedTask) => task.taskId === taskId);
  if (!task) {
      task = { taskId, status: 'in progress', videoUrl: '', completedAt: null };
      lesson.completedTasks.push(task);
  }

  await user.save();
  return task;
};

export const completeTask = async (userId: string, lessonId: string, taskId: string) => {
  const user = await User.findOne({ userId });
  if (!user) throw new Error('User not found');

  const lesson = user.completedLessons.find((lesson: ICompletedLesson) => lesson.lessonId === lessonId);
  if (!lesson) throw new Error('Lesson not found');

  const task = lesson.completedTasks.find((task: ICompletedTask) => task.taskId === taskId);
  if (task) {
      task.status = 'complete';
      task.completedAt = new Date();
      updateStreak(user); // Update streak on task completion
      await user.save();
  }
};