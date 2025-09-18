import express from "express";
import { signup, login, addContact } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/contacts", auth, addContact);

export default router;
