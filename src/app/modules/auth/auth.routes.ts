import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth.mliddleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", AuthControllers.loginUser);
router.post("/create-accesstoken", AuthControllers.createAccessTokenByRefresh);
router.post(
  "/change-password",
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.USER
  ),
  AuthControllers.changePassword
);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;
