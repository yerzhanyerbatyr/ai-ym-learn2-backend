import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExercise extends Document {
  description: string;
  type: string;
  words: string[];
  videoUrls: string[];
  correctAnswer: string | Array<{ word: string; videoUrl: string }> | { word: string; videoUrl: string };
  xpValue: number;
}

export interface IQuiz extends Document {
  title: string;
  exercises: IExercise[];
}

export interface ITask extends Document {
  taskNumber: number;
  word: string;
  description: string;
  status: string;
  videoUrl: string;
  xpValue: number;
  duration: number;
}

export interface ILesson extends Document {
  lessonNumber: number;
  title: string;
  tasks: ITask[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  lessons: ILesson[];
  quiz: IQuiz[];
}

const exerciseSchema = new Schema<IExercise>({
  description: { type: String, required: true },
  type: { type: String, required: true },
  words: { type: [String], default: [] },
  videoUrls: { type: [String], default: [] },
  correctAnswer: { type: Schema.Types.Mixed, required: true }, // Supports both string and array
  xpValue: { type: Number, required: true },
});

const quizSchema = new Schema<IQuiz>({
    title: { type: String, required: true },
    exercises: [exerciseSchema]
});

const taskSchema = new Schema<ITask>({
  taskNumber: { type: Number, required: true },
  word: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "incomplete" },
  videoUrl: { type: String, required: true },
  xpValue: { type: Number, required: true },
  duration: { type: Number, required: true },
});

const lessonSchema = new Schema<ILesson>({
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: { type: [lessonSchema], default: [] },
  quiz: { type: [quizSchema], default: [] },
});

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
