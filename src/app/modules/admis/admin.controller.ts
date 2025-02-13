import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../utils/pick";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["searchTerms", "email", "contactNumber"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllAdminFromDB(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data Retrive successfully",
    data: result,
  });
});

// get admin id

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.getAdminbyIdFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Retrived Admin",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.updateAdminIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data Update successfully",
    data: result,
  });
});
//  by id
const updateAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.updateAdminByIdInToDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin Data Update by id successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminServices.deleteAdminFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin Data deleted successfully",
      data: result,
    });
  }
);

export const adminControllers = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  updateAdminById,
  deleteAdmin,
};
