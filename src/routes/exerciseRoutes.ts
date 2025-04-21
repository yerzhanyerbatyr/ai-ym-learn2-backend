import { Router } from "express";
import * as ExerciseController from "../controllers/exerciseController";

const router = Router({ mergeParams: true });  // mergeParams allows accessing courseId and lessonId from parent route

router.post("/", ExerciseController.addExercise);
router.get("/", ExerciseController.getExercises);
router.get("/:exerciseId", ExerciseController.getExerciseById);
router.put("/:exerciseId", ExerciseController.updateExercise);
router.delete("/:exerciseId", ExerciseController.deleteExercise);

export default router;