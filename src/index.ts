import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./database/connect";
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());

connectToMongoDB().catch((error) => {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.use(express.json());
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
