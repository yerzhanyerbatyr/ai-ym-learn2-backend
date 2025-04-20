import mongoose, { Schema, Document } from "mongoose";

export type UserRole = 'admin' | 'teacher' | 'student';
export type Status = 'incomplete' | 'in progress' | 'pass' | 'fail';

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
  courseTitle: string | null;
  status: string; // e.g., 'complete', 'incomplete'
  completedAt: Date | null;
  courseLessons: ILesson[] | null;
  courseQuiz: IQuiz | null;
}

export interface IQuiz extends Document {
  quizId: string;
  title: string;
  exercises: IExercise[];
  score: number;
  completedAt: Date;
}

export interface IExercise extends Document {
    status: Status;
    userChoice: string | Array<{ word: string; videoUrl: string }> | { word: string; videoUrl: string };
    exerciseId: string;
    xpValue: number;
}

export interface IUser extends Document {
  userId: string;
  role: UserRole;
  totalXp: number;
  streakCount: number;
  lastActiveDay: Date;
  userCourses: ICourse[];
}

const exerciseSchema = new Schema<IExercise>({
  status: { type: String, enum: ['incomplete', 'pass', 'fail'],  default: 'incomplete' },
  userChoice: { type: Schema.Types.Mixed },
  xpValue: { type: Number, required: true },
  exerciseId: { type: String, required: true },
});

const quizSchema = new Schema<IQuiz>({
    quizId: { type: String},
    title: { type: String, required: true },
    exercises: [exerciseSchema],
    score: { type: Number },
    completedAt: Date,
});

const taskSchema = new Schema<ITask>({
  taskId: { type: String, ref: "Task", required: true },
  status: { type: String, enum: ['incomplete', 'pass', 'fail'], default: "incomplete" },
  videoUrl: { type: String, required: false },
  completedAt: Date,
});

const lessonSchema = new Schema<ILesson>({
  lessonId: {
    type: String,
    ref: "Lesson",
    required: true,
  },
  status: { type: String, enum: ['incomplete', 'in progress', 'complete'], default: "incomplete" },
  completedAt: Date,
  lessonTasks: [taskSchema],
});

const courseSchema = new Schema<ICourse>({
  courseId: {
    type: String,
    ref: "Course",
    required: true,
  },
  courseTitle: { type: String, required: false },
  status: { type: String, default: "incomplete" },
  completedAt: Date || null,
  courseLessons: [lessonSchema],
  courseQuiz: quizSchema
});

const futureDate = new Date('9999-12-31');

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  totalXp: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDay: { type: Date, default: futureDate },
  userCourses: { type: [courseSchema], default: [] }
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
