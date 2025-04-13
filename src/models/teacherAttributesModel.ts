import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITeacherAttributes extends Document {
  userId: string; 
  certificates: string[];
  motivation: string;
  coursePlan: string; 
  coursesToCreate: string[];
  status: "pending" | "approved" | null; 
  createdAt?: Date;
  updatedAt?: Date;
}

const teacherAttributesSchema = new Schema<ITeacherAttributes>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    certificates: {
      type: [String],
      default: [],
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
      enum: ["pending", "approved", null],
      default: null,  // Initially set to null or pending if needed
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
