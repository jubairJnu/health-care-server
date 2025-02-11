const paginateAndSort = (options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page: number = Number(options.page) || 1;
  const limit: number | "ALL" = Number(options.limit) || "ALL";
  const skip: number = limit === "ALL" ? 0 : (page - 1) * limit;

  const sortBy = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginateAndSort;
