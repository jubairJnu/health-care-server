import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth.mliddleware";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserRole } from "@prisma/client";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.parse(JSON.parse(req.body.data));

    return userControllers.createUserAndAdmin(req, res, next);
  }
);

export const userRoutes = router;
