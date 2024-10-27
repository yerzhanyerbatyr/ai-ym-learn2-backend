import mongoose, { Schema, Document } from "mongoose";

interface IExercise extends Document {
  exerciseId: number;
  description: string;
  answerOptions: string[];
  correctAnswer: string;
  xpValue: number;
}

interface IQuiz extends Document {
  quizId: number;
  exercises: IExercise[];
}

interface ITask extends Document {
  taskId: number;
  description: string;
  status: string;
  videoUrl: string;
  xpValue: number;
  duration: number;
}

interface ILesson extends Document {
  lessonId: number;
  title: string;
  tasks: ITask[];
}

interface ICourse extends Document {
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
  tasks: [taskSchema],
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema],
  quiz: [quizSchema],
});

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
