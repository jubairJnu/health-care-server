import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import pick from "../../../utils/pick";
import { userFilterableFields } from "./user.constance";

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
const createUserAndDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createUserAndDoctorIntoDB(req);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Doctor created successfully",
      data: result,
    });
  }
);

const getAlluser = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await userServices.getAllUsersFromDB(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User Data Retrive successfully",
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userServices.updateUserStatus(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User updated successfully",
    data: result,
  });
});

// export

export const userControllers = {
  createUserAndAdmin,
  createUserAndDoctor,
  getAlluser,
  updateUser,
};
