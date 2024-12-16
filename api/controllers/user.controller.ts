import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error";
import bcryptjs from "bcryptjs";
import User from "../models/user.model";

export const test = (req: Request, res: Response) => {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  if (!req.user) {
    return next(errorHandler(401, "Authentication failed"));
  }
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "¡You can only update your own account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true },
    );
    //@ts-ignore
    const { password, ...rest } = updatedUser?._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
