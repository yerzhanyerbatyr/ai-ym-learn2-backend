import { Router } from "express";
import * as QuizContoller from "../controllers/quizController";

const router = Router({ mergeParams: true });  // mergeParams allows accessing courseId from parent route

router.post("/", QuizContoller.addQuiz);
router.get("/", QuizContoller.getQuiz);
router.put("/:quizId", QuizContoller.updateQuiz);
router.delete("/:quizId", QuizContoller.deleteQuiz);

export default router;