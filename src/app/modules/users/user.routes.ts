import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth.mliddleware";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserRole } from "@prisma/client";
import { doctorCreateValidation, userValidation } from "./user.validation";

const router = Router();

router.get("/", userControllers.getAlluser);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.parse(JSON.parse(req.body.data));

    return userControllers.createUserAndAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = doctorCreateValidation.parse(JSON.parse(req.body.data));

    return userControllers.createUserAndDoctor(req, res, next);
  }
);
router.patch("/:id/status", userControllers.updateUser);

export const userRoutes = router;
