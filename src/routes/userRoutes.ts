import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/usersController";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
//middlerware JWT, H
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token no encontrado" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token no encontrado" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.error("Token inválido", err);
    res.status(403).json({ error: "No tienen acceso a este recurso" });
  }
};
router.post("/", authenticateToken, createUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
