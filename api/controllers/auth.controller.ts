import { Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";

export const signup = async (req: Request, res: Response) => {
  console.log(req.body);
  const {
    username,
    password,
    email,
  }: { username: string; password: string; email: string } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    //@ts-ignore
    res.status(500).json(error.message);
  }
};
