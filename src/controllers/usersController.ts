import { Request, Response } from "express";
import prisma from "../models/user";
import { hashPassword } from "../services/password.service";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email es requerido" });
      return;
    }

    if (!password) {
      res.status(400).json({ error: "Password es requerido" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "Email ya existe" });
      return;
    }

    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;

  try {
    if (!userId) {
      res.status(400).json({ error: "Id es requerido" });
      return;
    }

    let dataToUpdate: any = { ...req.body };

    if (password) {
      const hashedPassword = await hashPassword(password);
      dataToUpdate.password = hashedPassword;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    const user = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });
    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "Email ya existe" });
      return;
    }
    console.log(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.delete({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({
      message: `Usuario ${user.email} eliminado correctamente`,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};
