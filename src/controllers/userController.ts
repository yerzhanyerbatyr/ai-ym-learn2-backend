import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params.userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.status(200);
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const getUserCompletedCourses = async (req: Request, res: Response) => {
  try {
    const completedCourses = await userService.getUserCompletedCourses(req.params.userId);
    res.status(200).json(completedCourses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching completed lessons' });
  }
};

export const getUserTakenQuizzes = async (req: Request, res: Response) => {
  try {
    const takenQuizzes = await userService.getUserTakenQuizzes(req.params.userId);
    res.status(200).json(takenQuizzes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quiz history' });
  }
};

export const startCourseController = async (req: Request, res: Response) => {
  try {
      const { userId, courseId } = req.body;
      const lessons = await userService.startCourse(userId, courseId);
      res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const startLessonController = async (req: Request, res: Response) => {
  try {
      const { userId, lessonId } = req.body;
      const tasks = await userService.startLesson(userId, lessonId);
      res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const completeLessonController = async (req: Request, res: Response) => {
  try {
      const { userId, lessonId } = req.body;
      await userService.completeLesson(userId, lessonId);
      res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const startTaskController = async (req: Request, res: Response) => {
  try {
      const { userId, lessonId, taskId } = req.body;
      const task = await userService.startTask(userId, lessonId, taskId);
      res.status(200).json(task);
  } catch (error) {
      res.status(500).json({ error: (error as Error).message });
  }
};

export const completeTaskController = async (req: Request, res: Response) => {
  try {
      const { userId, lessonId, taskId } = req.body;
      await userService.completeTask(userId, lessonId, taskId);
      res.status(200).send();
  } catch (error) {
      res.status(500).json({ error: (error as Error).message });
  }
};