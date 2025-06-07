import { Router } from "express";
import {
  createUser,
  getUserById,
  loginUser,
  verifyUserToken,
} from "./controller/index.js";
import { authenticateUser } from "../../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/verifytoken", authenticateUser, verifyUserToken);
userRouter.post("/get/:userObjId", getUserById);

export default userRouter;
