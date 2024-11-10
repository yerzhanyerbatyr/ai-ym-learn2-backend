import { Request, Response } from "express";
import CourseService from "../services/courseService";

class courseController {
  async createCourse(req: Request, res: Response) {
    try {
      const course = await CourseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to create course" });
    }
  }

  async getCourses(req: Request, res: Response) {
    try {
      const courses = await CourseService.getCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve courses" });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ error: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve course" });
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const course = await CourseService.updateCourse(req.params.id, req.body);
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to update course" });
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      await CourseService.deleteCourse(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  }

  async getVocabularyList(req: Request, res: Response) {
    try {
      const vocabularyList = await CourseService.getVocabularyList(req.params.id);
      res.status(200).json(vocabularyList);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve vocabulary list" });
    }
  }
}

export default new courseController();
