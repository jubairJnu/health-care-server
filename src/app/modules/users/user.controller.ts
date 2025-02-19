import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";

const createUserAndAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.createUserAndAdminIntoDB(req);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("something went wrong");
  }
};

// export

export const userControllers = {
  createUserAndAdmin,
};
