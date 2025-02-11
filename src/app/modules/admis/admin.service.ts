import { Prisma, PrismaClient } from "@prisma/client";
import paginateAndSort from "../../../utils/paginateAndSort";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any, options: any) => {
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
          equals: filterData[key],
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

// exports

export const adminServices = {
  getAllAdminFromDB,
};
