import { Admin, Prisma } from "@prisma/client";
import paginateAndSort from "../../../utils/paginateAndSort";
import { prisma } from "../../../utils/prisma";
import { TAdminProps } from "./admin.interface";
import { TPagination } from "../../interfaces/paginateInterface";

const getAllAdminFromDB = async (params: TAdminProps, options: TPagination) => {
  const { page, limit, skip, sortBy, sortOrder } = paginateAndSort(options);

  const { searchTerms, ...filterData } = params;

  const conditionArray: Prisma.AdminWhereInput[] = [];

  const adminSearchableFields = ["name", "email"];
  // ? optimize way

  if (params.searchTerms) {
    conditionArray.push({
      OR: adminSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.AdminWhereInput = { AND: conditionArray };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit === "ALL" ? undefined : limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  return result;
};

//

const getAdminbyIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

// update with forieng key

const updateAdminIntoDB = async (id: string, payload: Partial<Admin>) => {
  const result = await prisma.$transaction(async (tx) => {
    // Fetch the user first to get their email
    const admin = await tx.admin.findUnique({
      where: { id },
      select: { email: true },
    });

    // Update User table
    await tx.user.update({
      where: { email: admin?.email },
      data: payload,
    });

    const updatedAdmin = await tx.admin.update({
      where: { id },
      data: payload,
    });

    return updatedAdmin;
  });

  return result;
};

//

const updateAdminByIdInToDB = async (id: string, payload: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// delete

const deleteAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.delete({
      where: {
        id,
      },
    });

    await tx.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });

    return deletedAdmin;
  });
  return result;
};

// exports

export const adminServices = {
  getAllAdminFromDB,
  getAdminbyIdFromDB,
  updateAdminIntoDB,
  updateAdminByIdInToDB,
  deleteAdminFromDB,
};
