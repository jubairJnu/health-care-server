import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../config";
import { fileUploader } from "../../../helpers/fileUploader";
const prisma = new PrismaClient();

const createUserAndAdminIntoDB = async (payload: any) => {
  const file = payload.file;
  // console.log(file,"in sercvicve")

  if (file) {
    const uplaodToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.body.admin.profilePhoto = uplaodToCloudinary?.secure_url;
  }

  const hash = bcrypt.hashSync(
    payload.body.password,
    Number(config.salt_round)
  );

  const userData = {
    email: payload?.body.admin.email,
    password: hash,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    // create admin

    const createAdmin = await tx.admin.create({
      data: payload.body.admin,
    });
    return createAdmin;
  });

  return result;
};

//  export

export const userServices = {
  createUserAndAdminIntoDB,
};
