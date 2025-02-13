import express, { Application } from "express";
import cors from "cors";

import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundApi from "./app/middlewares/notFound";

const app: Application = express();

app.use(cors());

// parser

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFoundApi);

export default app;
