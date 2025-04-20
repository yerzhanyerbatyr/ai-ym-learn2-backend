import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITeacherAttributes extends Document {
  userId: string; 
  certificates: string[];
  cv: string;
  motivation: string;
  coursePlan: string; 
  coursesToCreate: string[];
  status: "pending" | "approved" | "rejected" ; 
  teachingExperience?: string;
  signingDuration: "from birth" | "from kindergarten" | "from primary school" | "from school" | "other";
  signingDurationDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const teacherAttributesSchema = new Schema<ITeacherAttributes>(
  {
    userId: {
      type: String,
      required: true,
      unique: false,
    },
    certificates: {
      type: [String],
      default: [],
    },
    cv: {
      type: String,
      required: true,
    },
    motivation: {
      type: String,
      required: true,
    },
    coursePlan: {
      type: String,
      required: true,
    },
    coursesToCreate: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"]
    },
    teachingExperience: {
      type: String,
      default: null,
    },
    signingDuration: {
      type: String,
      enum: [
        "from birth",
        "from kindergarten",
        "from primary school",
        "from school",
        "other",
      ],
      required: true,
    },
    signingDurationDescription: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const TeacherAttributes =
  mongoose.models.TeacherAttributes ||
  mongoose.model<ITeacherAttributes>("TeacherAttributes", teacherAttributesSchema);

export default TeacherAttributes;
