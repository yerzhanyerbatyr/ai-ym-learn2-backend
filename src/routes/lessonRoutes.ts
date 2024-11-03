import { Router } from "express";
import * as LessonController from "../controllers/lessonController";

const router = Router({ mergeParams: true });  // mergeParams allows accessing courseId from parent route

router.post("/", LessonController.addLesson);
router.get("/", LessonController.getLessons);
router.get("/:lessonId", LessonController.getLessonById);
router.put("/:lessonId", LessonController.updateLesson);
router.delete("/:lessonId", LessonController.deleteLesson);

export default router;
