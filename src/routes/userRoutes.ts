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

userRouter.post('/course/start', userController.startCourseController);
userRouter.post('/task/start', userController.startTaskController);
userRouter.post('/task/complete', userController.completeTaskController);
userRouter.post('/lesson/complete', userController.completeLessonController);
userRouter.post('/course/complete', userController.completeCourseController);

userRouter.get('/:userId/quizes', userController.getUserQuizzes);


// userRouter.post('/lesson/start', startLessonController);
// userRouter.post('/lesson/complete', completeLessonController);
// userRouter.post('/task/start', startTaskController);
// userRouter.post('/task/complete', completeTaskController);

export default userRouter;