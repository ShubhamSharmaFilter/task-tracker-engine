import express from "express";
import userRouter from "./user/index.js";
import taskRouter from "./task/index.js";

const mainRouter = express.Router();

mainRouter.use("/auth", userRouter);
mainRouter.use("/tasks", taskRouter);

export default mainRouter;
