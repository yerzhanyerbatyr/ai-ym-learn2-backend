import { Types } from "mongoose";
import Course from "../models/courseModel";
import { ITask } from "../models/courseModel";

export const addTask = async (courseId: string, lessonId: string, taskData: ITask) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  lesson.tasks.push({ ...taskData, taskId: new Types.ObjectId() });
  await course.save();
  return course;
};

export const getTasks = async (courseId: string, lessonId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  return lesson.tasks;
};

export const getTaskById = async (courseId: string, lessonId: string, taskId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  return lesson.tasks.id(taskId);
};

export const updateTask = async (courseId: string, lessonId: string, taskId: string, taskData: Partial<ITask>) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  const task = lesson.tasks.id(taskId);
  if (!task) throw new Error("Task not found");

  task.set(taskData);
  await course.save();
  return task;
};

export const deleteTask = async (courseId: string, lessonId: string, taskId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  const task = lesson.tasks.id(taskId);
  if (!task) throw new Error("Task not found");

  task.remove();
  await course.save();
  return task;
};
