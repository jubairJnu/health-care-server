import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import config from "../../config";
import { IAuthenticatedRequest } from "../../interfaces/authenticate";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserInToDB(req.body);

  const { refreshToken, accessToken, needPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env == "developemnt" ? false : true,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Login Successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

// ? refresh token
const createAccessTokenByRefresh = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result =
      await AuthServices.createAccessByRefreshTokenFromDB(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env == "developemnt" ? false : true,
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Login Successfully",
      data: result,
    });
  }
);

//  change password

const changePassword = catchAsync(
  async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePasswordIntoDB(user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "changed succesfully",
      data: result,
    });
  }
);
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Sent Link succesfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "reset  succesfully",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  createAccessTokenByRefresh,
  changePassword,
  forgotPassword,
  resetPassword,
};
