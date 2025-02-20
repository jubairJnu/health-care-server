import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../config";
import { fileUploader } from "../../../helpers/fileUploader";
import { TPagination } from "../../interfaces/paginateInterface";
import paginateAndSort from "../../../utils/paginateAndSort";
import { userSearchableFields } from "./user.constance";
import { prisma } from "../../../utils/prisma";

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

const createUserAndDoctorIntoDB = async (payload: any) => {
  const file = payload.file;
  // console.log(file,"in sercvicve")

  // console.log(payload.body, "in service");

  if (file) {
    const uplaodToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.body.doctor.profilePhoto = uplaodToCloudinary?.secure_url;
  }

  const hash = bcrypt.hashSync(
    payload.body.password,
    Number(config.salt_round)
  );

  const userData = {
    email: payload?.body.doctor.email,
    password: hash,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    // create admin

    const createDoctor = await tx.doctor.create({
      data: payload.body.doctor,
    });
    return createDoctor;
  });

  return result;
};

const getAllUsersFromDB = async (params: any, options: TPagination) => {
  const { page, limit, skip, sortBy, sortOrder } = paginateAndSort(options);

  const { searchTerms, ...filterData } = params;

  const conditionArray: Prisma.UserWhereInput[] = [];

  // ? optimize way

  if (params.searchTerms) {
    conditionArray.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerms,
          mode: "insensitive",
        },
      })),
    });
  }

  //  ? filtetr

  if (Object.keys(filterData).length > 0) {
    conditionArray.push({
      AND: Object.keys(filterData)?.map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // ! non optimize way

  //   if (params.searchTerms) {
  //     conditionArray.push({
  //       OR: [
  //         {
  //           name: {
  //             contains: params.searchTerms,
  //             mode: "insensitive",
  //           },
  //         },
  //         {
  //           email: {
  //             contains: params.searchTerms,
  //             mode: "insensitive",
  //           },
  //         },
  //       ],
  //     });
  //   }

  const whereCondition: Prisma.UserWhereInput = { AND: conditionArray };

  const result = await prisma.user.findMany({
    where: whereCondition,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      doctor: true,
      admin: true,
    },
    skip,
    take: limit === "ALL" ? undefined : limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  return result;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const isExist = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.user.update({
    where: { id },
    data: status,
  });

  return result;
};

//  export

export const userServices = {
  createUserAndAdminIntoDB,
  createUserAndDoctorIntoDB,
  getAllUsersFromDB,
  updateUserStatus,
};
