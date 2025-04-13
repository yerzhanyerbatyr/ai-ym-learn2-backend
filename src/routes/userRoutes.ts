import { Router } from 'express';
import * as userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/:userId', userController.getUserById);
userRouter.put('/:userId', userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

userRouter.get('/:userId/user-courses', userController.getUserCourses);
userRouter.get('/:userId/user-completed-lesson-ids', userController.getUserCompletedLessonIds);
userRouter.get('/:userId/user-in-progress-lesson-id', userController.getInProgressLessonId);

userRouter.get('/:userId/lessons/:lessonId/tasks', userController.getLessonTasks);

userRouter.put('/:userId/course/:courseId/start', userController.startCourseController);

userRouter.put('/:userId/course/:courseId/lesson/:lessonId/complete', userController.completeLessonController);

userRouter.put('/task/complete', userController.completeTaskController);

userRouter.get('/:userId/quizzes', userController.getQuizzesByUserController);
userRouter.get('/:userId/quiz/:quizId', userController.getQuizByIdController);
userRouter.put('/exercise/complete', userController.completeExerciseController);

export default userRouter;