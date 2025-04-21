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
  description: string;
  category: string;
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
  difficultyLevel: string;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  lessons: ILesson[];
  quiz: IQuiz[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  category: string;
  languageProficiency: "beginner" | "pre-intermediate" | "intermediate" | "upper-intermediate" | "advanced" | "native";
  isSignLanguageCourse: boolean;
}

const exerciseSchema = new Schema<IExercise>({
  description: { type: String, required: true },
  type: { type: String, required: true },
  words: { type: [String], default: [] },
  videoUrls: { type: [String], default: [] },
  correctAnswer: { type: Schema.Types.Mixed, required: true }, // Supports both string and array
  xpValue: { type: Number, required: true, default: 10 },
});

const quizSchema = new Schema<IQuiz>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    exercises: { type: [exerciseSchema], default: [] },
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
  difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: { type: [lessonSchema], default: [] },
  quiz: { type: [quizSchema], default: [] },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  category: { type: String },
  languageProficiency: {
    type: String,
    enum: [
      "beginner",
      "pre-intermediate",
      "intermediate",
      "upper-intermediate",
      "advanced",
      "native"
    ],
    required: true,
    default: "beginner"
  },
  isSignLanguageCourse: { type: Boolean, default: true },
},
{
  timestamps: true
}
);

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
