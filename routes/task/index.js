import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "./controller/index.js";
import { authenticateUser } from "../../middlewares/auth.js";

const taskRouter = express.Router();

taskRouter.get("/", authenticateUser, getAllTasks);
taskRouter.get("/:id", authenticateUser, getTaskById);
taskRouter.post("/", authenticateUser, createTask);
taskRouter.put("/:id", authenticateUser, updateTask);
taskRouter.delete("/:id", authenticateUser, deleteTask);

export default taskRouter;
