import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUserAndAdminIntoDB = async (payload: any) => {
  const hash = bcrypt.hashSync(payload.password, 8);

  const userData = {
    email: payload?.admin.email,
    password: hash,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    // create admin

    const createAdmin = await tx.admin.create({
      data: payload.admin,
    });
    return createAdmin;
  });

  return result;
};

//  export

export const userServices = {
  createUserAndAdminIntoDB,
};
