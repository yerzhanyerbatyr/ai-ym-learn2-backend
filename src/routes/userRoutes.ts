import { Router } from 'express';
import { 
    createUser, getUserById, getUserCompletedCourses, 
    getUserTakenQuizzes, updateUser, deleteUser,
    startLessonController, completeLessonController,
    startTaskController, completeTaskController,
    startCourseController
} from '../controllers/userController';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.get('/:userId', getUserById);
userRouter.get('/:userId/completed-courses', getUserCompletedCourses);
userRouter.get('/:userId/quizes', getUserTakenQuizzes);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);
userRouter.post('/course/start', startCourseController);
userRouter.post('/lesson/start', startLessonController);
userRouter.post('/lesson/complete', completeLessonController);
userRouter.post('/task/start', startTaskController);
userRouter.post('/task/complete', completeTaskController);

export default userRouter;