import { Router } from "express";
import CourseController from "../controllers/courseController";

const router = Router();

router.post("/", CourseController.createCourse);
router.get("/", CourseController.getCourses);
router.get("/:id", CourseController.getCourseById);
router.put("/:id", CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);
router.get("/:id/vocabulary", CourseController.getVocabularyList);

export default router;
