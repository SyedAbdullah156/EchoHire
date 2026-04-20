import { Request, Response } from "express";
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} from "../services/user.service";

export const createUser = async (req: Request, res: Response) => {
  const user = await createUserService(req.body);
  res.json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await getUserByIdService(Number(req.params.id));
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await updateUserService(Number(req.params.id), req.body);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await deleteUserService(Number(req.params.id));
  res.json(result);
};