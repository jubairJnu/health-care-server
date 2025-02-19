import { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../utils/prisma";

import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/AppError";
import status from "http-status";
import emailSend from "../../../utils/sendEmail";

const loginUserInToDB = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password Is Incorrect");
  }

  const jwtPaload = {
    email: userData.email,
    role: userData.role,
    id: userData.email,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPaload,
    config.jwt_access_secret as Secret,
    config.jwt_expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    jwtPaload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string
  );

  return {
    needPasswordChange: userData.needPasswordChange,
    accessToken,
    refreshToken,
  };
};

// refresh token

const createAccessByRefreshTokenFromDB = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwtHelpers.verifyToken(token, "abaceegheojg") as JwtPayload;
  } catch (err) {
    throw new Error("you're not authorized");
  }

  const isExistUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const userPayload = {
    email: isExistUser.email,
    role: isExistUser.role,
    id: isExistUser.email,
  };

  const accessToken = jwtHelpers.generateToken(
    userPayload,
    config.jwt_access_secret as Secret,
    config.jwt_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: isExistUser.needPasswordChange,
  };
};

// ? changae password

const changePasswordIntoDB = async (
  user: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  //

  const isExistUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isExistUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    isExistUser.password
  );

  if (!isCorrectPassword) {
    throw new AppError(status.NOT_FOUND, "Old Password doen't match");
  }

  //  is all ok then update

  const hashPasword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_round)
  );

  const result = await prisma.user.update({
    where: {
      email: isExistUser.email,
    },
    data: {
      password: hashPasword,
    },
  });

  return result;
};

//  forgot password

const forgotPassword = async (payload: { email: string }) => {
  const isExistUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  //
  if (!isExistUser) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }

  const reseteToken = jwtHelpers.generateToken(
    { email: isExistUser.email },
    config.jwt_reset_secret as Secret,
    config.jwt_reset_expires_in as string
  );

  const resetLink = `http://localhost:3000/reset-password?email=${isExistUser.email}&token=${reseteToken} `;
  const html = `<p>

  <h3>
  Reset Your Password
  </h3>

  <div>
  <a href="${resetLink}" >
  <button style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; display: inline-block; border-radius: 5px;">
  
  
  Reset Password
  </button>
  </a>

  </div>
  
  </p>`;

  const sendMail = await emailSend(isExistUser.email, html);

  return sendMail;

  //  if have send eamil to the user email
};

//reset pasword

const resetPassword = async (paylaod: { token: string; password: string }) => {
  const verifyToken = jwtHelpers.verifyToken(
    paylaod.token,
    config.jwt_refresh_secret as Secret
  );
  if (!verifyToken) {
    throw new AppError(status.UNAUTHORIZED, "Invalid");
  }

  // if ok then update pass

  const password = await bcrypt.hash(
    String(paylaod.password),
    Number(config.salt_round)
  );

  const result = await prisma.user.update({
    where: {
      email: verifyToken.email,
    },
    data: {
      password,
    },
  });

  return result;
};

export const AuthServices = {
  loginUserInToDB,
  createAccessByRefreshTokenFromDB,
  changePasswordIntoDB,
  forgotPassword,
  resetPassword,
};
