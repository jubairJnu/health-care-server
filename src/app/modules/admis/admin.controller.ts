import e, { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../utils/pick";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, ["searchTerms", "email", "contactNumber"]);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await adminServices.getAllAdminFromDB(filter, options);
    res.status(200).json({
      success: true,
      message: "admin retrived successfully",
      statusCode: 200,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `${err.name || "somemthing went wrong"}`,
    });
  }
};

export const adminControllers = {
  getAllAdmin,
};
