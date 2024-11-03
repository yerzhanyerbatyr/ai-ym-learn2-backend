import { Router } from 'express';
import { createUser, getUserById, getUserCompletedLessons, getUserTakenQuizzes, updateUser, deleteUser } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/:userId', getUserById);
userRouter.get('/:userId/completed-lessons', getUserCompletedLessons);
userRouter.get('/:userId/quizes', getUserTakenQuizzes);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);

export default userRouter;