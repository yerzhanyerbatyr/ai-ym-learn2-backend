import { Types } from "mongoose";
import Course from "../models/courseModel";
import { ILesson } from "../models/courseModel";

export const addLesson = async (courseId: string, lessonData: ILesson) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");  
  course.lessons.push(lessonData);
  await course.save();
  return course;
};

export const getLessons = async (courseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  return course.lessons;
};

export const getLessonById = async (courseId: string, lessonId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  return course.lessons.id(lessonId);
};

export const updateLesson = async (
  courseId: string,
  lessonId: string,
  lessonData: Partial<ILesson>
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  lesson.set(lessonData);
  await course.save();
  return lesson;
};

export const deleteLesson = async (courseId: string, lessonId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const lesson = course.lessons.id(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  lesson.remove();
  await course.save();
  return lesson;
};
