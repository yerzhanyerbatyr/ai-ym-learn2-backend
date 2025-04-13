import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./database/connect";
import courseRouter from "./routes/courseRoutes";
import lessonRouter from "./routes/lessonRoutes";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";
import teacherRequestRouter from "./routes/teacherRequestsRoutes";
import cors from 'cors';
import bodyParser from 'body-parser';
console.log("Starting server...");

dotenv.config();

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.use(cors());

connectToMongoDB().catch((error) => {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use(express.json());
app.use("/api/course", courseRouter);
app.use("/api/teacherRequest", teacherRequestRouter);
app.use("/api/course/:courseId/lesson", lessonRouter);
app.use("/api/course/:courseId/lesson/:lessonId/task", taskRouter);

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
