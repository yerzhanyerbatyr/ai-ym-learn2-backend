import { Router } from "express";
import * as TaskController from "../controllers/taskController";

const router = Router({ mergeParams: true });  // mergeParams allows accessing courseId and lessonId from parent route

router.post("/", TaskController.addTask);
router.get("/", TaskController.getTasks);
router.get("/:taskId", TaskController.getTaskById);
router.put("/:taskId", TaskController.updateTask);
router.delete("/:taskId", TaskController.deleteTask);

export default router;
