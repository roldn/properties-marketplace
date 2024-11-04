import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";

dotenv.config();

mongoose
  .connect(process.env.MONGO!)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//@ts-ignore
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});
