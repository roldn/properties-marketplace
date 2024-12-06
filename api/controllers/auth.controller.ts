import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";

import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    const validUser = await User.findOne({ email: email }).lean();

    if (!validUser) {
      return next(errorHandler(404, "¡User not found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "¡Wrong credentials!"));
    }

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET!);

    const { password: pass, ...userInfo } = validUser;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60),
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //@ts-ignore
    const generateToken = (userData) => {
      return jwt.sign({ id: userData?._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d", // Optional: add token expiration
      });
    };

    if (user) {
      const token = generateToken(user);
      //@ts-expect-error
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);
      //@ts-expect-error
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    res
      .status(500)
      //@ts-expect-error
      .json({ message: "Something went wrong", error: error.message });
    next(error);
  }
};

// //@ts-ignore
// export const google = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       //@ts-ignore
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       //@ts-ignore
//       const { password: pass, ...rest } = user._doc;
//       res
//         .cookie('access_token', token, { httpOnly: true })
//         .status(200)
//         .json(rest);
//     } else {
//       const generatedPassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
//       const newUser = new User({
//         username:
//           req.body.name.split(' ').join('').toLowerCase() +
//           Math.random().toString(36).slice(-4),
//         email: req.body.email,
//         password: hashedPassword,
//         avatar: req.body.photo,
//       });
//       await newUser.save();
//       //@ts-ignore
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//       //@ts-ignore
//       const { password: pass, ...rest } = newUser._doc;
//       res
//         .cookie('access_token', token, { httpOnly: true })
//         .status(200)
//         .json(rest);
//     }
//   } catch (error) {
//     res
//       .status(500)
//       //@ts-expect-error
//       .json({ message: "Something went wrong", error: error.message });
//     next(error);
//   }
// };
