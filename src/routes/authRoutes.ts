import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
//api rest de usuarios
router.post("/login", login);

export default router;
