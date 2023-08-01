import { Response } from "express";

export const badRequest = (res: Response, message: any) => {
  return res.status(400).json({ message });
};
