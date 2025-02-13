import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err,"in global")
  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message || "Something went wrong",
    error: err,
  });
  next();
};

export default globalErrorHandler;
