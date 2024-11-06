import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";

import jwt from 'jsonwebtoken';
import { userInfo } from "os";
import { SignJsonWebKeyInput } from "crypto";


export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
  } catch (error: any) {
    next(errorHandler(550, error.message));
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({email: email}).lean();

    if(!validUser){return next(errorHandler(404, '¡User not found!'))};

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if(!validPassword){return next(errorHandler(401, '¡Wrong credentials!'))};

    const token = jwt.sign({id: validUser.id}, process.env.JWT_SECRET!);

    const {password: pass, ...userInfo} = validUser;

    res.cookie('access_token', token, {httpOnly: true, expires:new Date(Date.now()+ 24*60*60)}).status(200).json(userInfo)

  } catch (error) {
    next(error)
  }
};