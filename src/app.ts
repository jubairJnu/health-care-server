import express, { Application } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/users/user.routes";
import { adminRoutes } from "./app/modules/admis/admin.routes";

const app: Application = express();

app.use(cors());

// parser

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admins", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
