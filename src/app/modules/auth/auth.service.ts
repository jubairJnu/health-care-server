import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../utils/prisma";

import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

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

  const accessToken = jwtHelpers.generateToken(jwtPaload, "abcedef", "15m");
  const refreshToken = jwtHelpers.generateToken(
    jwtPaload,
    "abaceegheojg",
    "30d"
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

  const accessToken = jwtHelpers.generateToken(userPayload, "abcedef", "15m");

  return {
    accessToken,
    needPasswordChange: isExistUser.needPasswordChange,
  };
};

export const AuthServices = {
  loginUserInToDB,
  createAccessByRefreshTokenFromDB,
};
