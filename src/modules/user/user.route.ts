import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.login);
router.post("/signout", userController.logout);
router.post("/refresh-token", userController.refreshToken);
router.get("/me", auth, userController.authUser);
router.post("/contacts", auth, userController.addContact);

export default router;
