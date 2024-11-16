//run -->     ts-node src/database/seedDatabase.ts   -->to update lessons db

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Lesson from "../models/courseModel";
import connectToMongoDB from "./connect";
import Course from "../models/courseModel";

const jsonFilePath = path.resolve(__dirname, "../data/courses.json");
const coursesData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

const seedDatabase = async () => {
  try {
    await connectToMongoDB();
    await Course.deleteMany();
    console.log("All courses deleted");
    await Course.insertMany(coursesData);
    console.log("Courses inserted successfully");
  } catch (error) {
    console.error("Error inserting courses:", error);
  } finally {
    mongoose.connection.close(); // Close connection
  }
};

seedDatabase();
