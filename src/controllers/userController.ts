import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).json({ message: 'User added successfully' });
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

export const getUserCourses = async (req: Request, res: Response) => {
  try {
    const userCourses = await userService.getUserCourses(req.params.userId);
    res.status(200).json(userCourses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching completed lessons' });
  }
};

export const getUserCompletedLessonIds = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const completedLessonIds = await userService.getUserCompletedLessonIds(userId);
    res.status(200).json(completedLessonIds);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getInProgressLessonId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const lessonId = await userService.getInProgressLessonId(userId);
    res.status(200).json({ lessonId });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getLessonTasks = async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.params;
    const tasks = await userService.getLessonTasksById(userId, lessonId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const startCourseController = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;
    await userService.startCourse(userId, courseId);
    res.status(200).json({ message: 'Course started successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const completeTaskController = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, lessonId, taskId, status } = req.body;
    await userService.completeTask(userId, courseId, lessonId, taskId, status);
    res.status(200).json({ message: 'Task completed successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const completeLessonController = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, lessonId } = req.params;
    await userService.completeLesson(userId, courseId, lessonId);
    res.status(200).json({ message: 'Lesson completed successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getQuizzesByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const quizzes = await userService.getUserQuizzes(userId);
    res.status(200).json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuizByIdController = async (req: Request, res: Response) => {
  try {
    const { userId, quizId } = req.params;
    const exercises = await userService.getUserQuizzesByCourseId(userId, quizId);
    res.status(200).json(exercises);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeExerciseController = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, quizId, exerciseId, status } = req.body;
    await userService.completeExercise(userId, courseId, quizId, exerciseId, status);
    res.status(200).json({ message: 'Exercise completed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeQuizController = async (req: Request, res: Response) => {
  try {
    const { userId, quizId } = req.params;
    await userService.completeQuiz(userId, quizId);
    res.status(200).json({ message: 'Quiz completed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};