import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.loginUser);
router.post("/create-accesstoken", AuthControllers.createAccessTokenByRefresh);

export const AuthRoutes = router;
