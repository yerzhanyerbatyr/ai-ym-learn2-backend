import { Request, Response } from "express";
import * as ExerciseService from "../services/exerciseService";

export const addExercise = async (req: Request, res: Response) => {
  try {
    const exercise = await ExerciseService.addExercise(req.params.courseId, req.params.quizId, req.body);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseService.getExercise(req.params.courseId, req.params.quizId);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const exercise = await ExerciseService.getExerciseById(req.params.courseId, req.params.quizId, req.params.exerciseId);
    if (exercise) {
      res.status(200).json(exercise);
    } else {
      res.status(404).json({ error: "Exercise not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const exercise = await ExerciseService.updateExercise(req.params.courseId, req.params.quizId, req.params.exerciseId, req.body);
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    await ExerciseService.deleteExercise(req.params.courseId, req.params.quizId, req.params.exerciseId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
