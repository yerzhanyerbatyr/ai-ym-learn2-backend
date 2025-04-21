import { Types } from "mongoose";
import Course from "../models/courseModel";
import { IQuiz } from "../models/courseModel";

export const addQuiz = async (courseId: string, quizData: IQuiz) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");  
  course.quiz.push(quizData);
  await course.save();
  return course;
};

export const getQuiz = async (courseId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  return course.quiz[0];
};

export const updateQuiz = async (
  courseId: string,
  quizId: string,
  quizData: Partial<IQuiz>
) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  quiz.set(quizData);
  await course.save();
  return quiz;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const quiz = course.quiz.id(quizId);
  if (!quiz) throw new Error("Quiz not found");

  quiz.remove();
  await course.save();
  return quiz;
};
