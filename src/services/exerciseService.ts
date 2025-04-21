import { Types } from "mongoose";
import Course from "../models/courseModel";
import { IExercise } from "../models/courseModel";

export const addExercise = async (courseId: string, quizId: string, exerciseData: IExercise) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  quiz.exercises.push({ ...exerciseData, exerciseId: new Types.ObjectId() });
  await course.save();
  return course;
};

export const getExercise = async (courseId: string, quizId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  return quiz.exercises;
};

export const getExerciseById = async (courseId: string, quizId: string, exerciseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  return quiz.exercises.id(exerciseId);
};

export const updateExercise = async (courseId: string, quizId: string, exerciseId: string, exerciseData: Partial<IExercise>) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const exercise = quiz.exercises.id(exerciseId);
  if (!exercise) throw new Error("Exercise not found");

  exercise.set(exerciseData);
  await course.save();
  return exercise;
};

export const deleteExercise = async (courseId: string, quizId: string, exerciseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.lessons.id(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  const exercise = quiz.exercises.id(exerciseId);
  if (!exercise) throw new Error("Exercise not found");

  exercise.remove();
  await course.save();
  return exercise;
};