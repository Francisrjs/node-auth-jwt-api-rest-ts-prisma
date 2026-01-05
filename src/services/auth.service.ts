const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
import jwt from "jsonwebtoken";
import { User } from "../models/user.interface";
export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
