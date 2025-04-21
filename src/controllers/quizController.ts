import { Request, Response } from "express";
import * as QuizService from "../services/quizService";

export const addQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await QuizService.addQuiz(req.params.courseId, req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await QuizService.getQuiz(req.params.courseId);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await QuizService.updateQuiz(req.params.courseId, req.params.quizId, req.body);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    await QuizService.deleteQuiz(req.params.courseId, req.params.quizId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}