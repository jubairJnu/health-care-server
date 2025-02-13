import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { adminRoutes } from "../modules/admis/admin.routes";

const router = Router();

const modulesRoutes = [
  {
    path: "/users",
    routes: userRoutes,
  },
  {
    path: "/admins",
    routes: adminRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;
