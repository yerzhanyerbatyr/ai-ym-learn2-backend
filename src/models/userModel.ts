import mongoose, { Schema, Document } from "mongoose";

export interface ICompletedTask extends Document {
  taskId: mongoose.Schema.Types.ObjectId;
  status: string; // e.g., 'complete', 'incomplete';
  videoUrl: string;
  completedAt: Date;
}

export interface ICompletedLesson extends Document {
  lessonId: mongoose.Schema.Types.ObjectId;
  status: string; // e.g., 'complete', 'incomplete'
  completedAt: Date;
  completedTasks: ICompletedTask[];
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
  completedLessons: ICompletedLesson[];
  takenQuizzes: IQuiz[];
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

const completedTaskSchema = new Schema<ICompletedTask>({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  status: { type: String, default: "incomplete" },
  videoUrl: { type: String, required: false },
  completedAt: Date,
});

const completedLessonSchema = new Schema<ICompletedLesson>({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  status: { type: String, default: "incomplete" },
  completedAt: Date,
  completedTasks: [completedTaskSchema],
});

const futureDate = new Date('9999-12-31');

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  totalXp: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDay: { type: Date, default: futureDate },
  completedLessons: { type: [completedLessonSchema], default: [] },
  takenQuizzes: { type: [quizSchema], default: [] },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
