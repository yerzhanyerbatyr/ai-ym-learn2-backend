import { Router } from 'express';
import { createUser, getUserById, getUserCompletedLessons, getUserTakenQuizzes, updateUser, deleteUser } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/:id', getUserById);
userRouter.get('/:id/completed-lessons', getUserCompletedLessons);
userRouter.get('/:id/quizes', getUserTakenQuizzes);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;