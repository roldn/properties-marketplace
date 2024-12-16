import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./error";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));
  try {
    const test = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(test);
    //@ts-ignore
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) return next(errorHandler(403, "Forbidden"));
      //@ts-ignore
      req.user = user;

      next();
    });
  } catch (error) {
    next(error);
  }
};
