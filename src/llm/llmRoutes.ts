// backend/src/gpt/gpt-router.ts
import { Router, Request, Response } from 'express';
import LLMService from './llmService';
import LLMController from './llmController';

const llmRouter = Router();
const llmService = new LLMService();
const llmController = new LLMController(llmService);

llmRouter.post('/generate-quiz/:courseId', llmController.generateQuiz);

export default llmRouter;