import { Request, Response } from "express";
import { getAllUsersSvc } from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsersSvc();

  return res.status(200).json(users);
};
