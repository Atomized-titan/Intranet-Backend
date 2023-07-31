import { NextFunction, Request, Response } from "express";
import {
  getAllUsersSvc,
  getUserByIdSvc,
  addUserSvc,
  deleteUserSvc,
} from "../services/user.service";
export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await getAllUsersSvc();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const user = await getUserByIdSvc(userId);
      if (!user) {
        return res.sendStatus(404);
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.body;
      const newUser = await addUserSvc(name, email);
      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      await deleteUserSvc(userId);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
