import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth.mliddleware";

const router = Router();

router.post("/", auth("SUPER_ADMIN"), userControllers.createUserAndAdmin);

export const userRoutes = router;
