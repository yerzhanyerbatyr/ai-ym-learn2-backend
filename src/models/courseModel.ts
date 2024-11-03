import mongoose, { Schema, Document } from "mongoose";

export interface IExercise extends Document {
  exerciseId: number;
  description: string;
  answerOptions: string[];
  correctAnswer: string;
  xpValue: number;
}

export interface IQuiz extends Document {
  quizId: number;
  exercises: IExercise[];
}

export interface ITask extends Document {
  taskId: number;
  description: string;
  status: string;
  videoUrl: string;
  xpValue: number;
  duration: number;
}

export interface ILesson extends Document {
  lessonId: number;
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
  exerciseId: { type: Number, required: true },
  description: { type: String, required: true },
  answerOptions: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  xpValue: { type: Number, required: true },
});

const quizSchema = new Schema<IQuiz>({
  quizId: { type: Number, required: true },
  exercises: [exerciseSchema],
});

const taskSchema = new Schema<ITask>({
  taskId: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "incomplete" },
  videoUrl: { type: String },
  xpValue: { type: Number, required: true },
  duration: { type: Number, required: true },
});

const lessonSchema = new Schema<ILesson>({
  lessonId: { type: Number, required: true },
  title: { type: String, required: true },
  tasks: {type: [taskSchema],  default: []},
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: {type: [lessonSchema],  default: []},
  quiz: {type: [quizSchema],  default: []},
});

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
