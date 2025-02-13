import { Router } from "express";
import { adminControllers } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { adminValidatonSchema } from "./admin.constance";

const router = Router();

router.get("/", adminControllers.getAllAdmin);
router.get("/:id", adminControllers.getAdminById);
router.patch("/:id", adminControllers.updateAdmin);
router.patch(
  "/by-id/:id",
  validateRequest(adminValidatonSchema.update),
  adminControllers.updateAdminById
);
router.delete("/:id", adminControllers.deleteAdmin);

export const adminRoutes = router;
