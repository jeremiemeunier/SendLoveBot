import { WindmillRequest } from "@/types/Request.type";
import { NextFunction, Response } from "express";

const isBot = async (
  req: WindmillRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.botid === process.env.BOT_ID) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

export default isBot;
