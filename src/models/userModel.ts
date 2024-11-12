import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskId: string;
  status: string; // e.g., 'complete', 'incomplete';
  videoUrl: string;
  completedAt: Date;
}

export interface ILesson extends Document {
  lessonId: string;
  status: string; // e.g., 'complete', 'incomplete'
  completedAt: Date;
  lessonTasks: ITask[];
}

export interface ICourse extends Document {
  courseId: string;
  status: string; // e.g., 'complete', 'incomplete'
  completedAt: Date;
  courseLessons: ILesson[];
}

export interface IQuiz extends Document {
    quizId: number;
    exercises: IExercise[];
    score: number;
}

export interface IExercise extends Document {
    exerciseId: number;
    status: string;
}

export interface IUser extends Document {
  userId: string;
  totalXp: number;
  streakCount: number;
  lastActiveDay: Date;
  userCourses: ICourse[];
  userQuizzes: IQuiz[];
}

const exerciseSchema = new Schema<IExercise>({
    exerciseId: { type: Number, required: true },
    status: { type: String, default: "incomplete" },
});

const quizSchema = new Schema<IQuiz>({
    quizId: { type: Number, required: true },
    exercises: [exerciseSchema],
    score: { type: Number, required: true },
});

const taskSchema = new Schema<ITask>({
  taskId: { type: String, ref: "Task", required: true },
  status: { type: String, default: "incomplete" },
  videoUrl: { type: String, required: false },
  completedAt: Date,
});

const lessonSchema = new Schema<ILesson>({
  lessonId: {
    type: String,
    ref: "Lesson",
    required: true,
  },
  status: { type: String, default: "incomplete" },
  completedAt: Date,
  lessonTasks: [taskSchema],
});

const courseSchema = new Schema<ICourse>({
  courseId: {
    type: String,
    ref: "Course",
    required: true,
  },
  status: { type: String, default: "incomplete" },
  completedAt: Date,
  courseLessons: [lessonSchema],
});

const futureDate = new Date('9999-12-31');

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  totalXp: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDay: { type: Date, default: futureDate },
  userCourses: { type: [courseSchema], default: [] },
  userQuizzes: { type: [quizSchema], default: [] },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
