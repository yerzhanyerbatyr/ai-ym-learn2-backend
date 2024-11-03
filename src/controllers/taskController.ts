import { Request, Response } from "express";
import * as TaskService from "../services/taskService";

export const addTask = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.addTask(req.params.courseId, req.params.lessonId, req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getTasks(req.params.courseId, req.params.lessonId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.getTaskById(req.params.courseId, req.params.lessonId, req.params.taskId);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.updateTask(req.params.courseId, req.params.lessonId, req.params.taskId, req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await TaskService.deleteTask(req.params.courseId, req.params.lessonId, req.params.taskId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
