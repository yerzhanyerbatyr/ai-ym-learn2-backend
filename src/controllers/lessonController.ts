import { Request, Response } from "express";
import * as LessonService from "../services/lessonService";

export const addLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await LessonService.addLesson(req.params.courseId, req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await LessonService.getLessons(req.params.courseId);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await LessonService.getLessonById(req.params.courseId, req.params.lessonId);
    if (lesson) {
      res.status(200).json(lesson);
    } else {
      res.status(404).json({ error: "Lesson not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await LessonService.updateLesson(req.params.courseId, req.params.lessonId, req.body);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    await LessonService.deleteLesson(req.params.courseId, req.params.lessonId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}