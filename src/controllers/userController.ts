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
        res.status(200).json(user);
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const getUserCompletedLessons = async (req: Request, res: Response) => {
  try {
    const completedLessons = await userService.getUserCompletedLessons(req.params.userId);
    res.status(200).json(completedLessons);
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
