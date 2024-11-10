import LLMService from "./llmService";
import { Request, Response } from "express";

class LLMController {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  generateQuiz = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const quiz = await this.llmService.generateQuiz(courseId);

      console.log("OpenAI API response:", JSON.parse(quiz));
      res.status(201).json(JSON.parse(quiz));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default LLMController;
