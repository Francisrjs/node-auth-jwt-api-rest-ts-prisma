import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";
import { compare } from "bcrypt";
//Tipado en request y response, promesa devuelve en vació
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email) {
      res.status(400).json({ error: "Email es requerido" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "Password es requerido" });
      return;
    }
    const hasedPassword = await hashPassword(password);
    console.log(hasedPassword);

    //Instancia para crear un usuario en la base de datos SQL
    const user = await prisma.create({
      data: {
        email,
        password: hasedPassword,
      },
    });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    console.log(error);

    if (error?.code === "P2002") {
      res.status(400).json({ error: "Email ya existe" });
      return;
    }
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: "Credenciales inválidas" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "Password es requerido" });
      return;
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }
    res.status(200).json({ token: generateToken(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
