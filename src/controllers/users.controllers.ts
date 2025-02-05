import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateJWTToken } from "../config/passport-config";
import {
  addUserSvc,
  deleteUserSvc,
  getAllUsersSvc,
  getUserByEmailSvc,
  getUserByIdSvc,
  updateUserSvc,
} from "../services/user.service";
import { badRequest } from "../views/views";
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
      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async addUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const newUser = await addUserSvc(name, email, password);
      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);

      // Get the existing user from the database
      const existingUser = await getUserByIdSvc(userId);
      if (!existingUser) {
        return res.sendStatus(404);
      }

      // Extract the updated details from the request body
      const { name, email, password } = req.body;

      // Call the updateUserSvc function to update the user details
      const updatedUser = await updateUserSvc(userId, name, email, password);

      delete updatedUser.password; // Remove password from the response

      return res.status(200).json(updatedUser);
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

  static async signup(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return badRequest(res, errors.array());
    }

    const { name, email, password } = req.body;

    try {
      // Check if the user with the given email already exists
      const existingUser = await getUserByEmailSvc(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Create the user and save to the database
      const newUser = await addUserSvc(name, email, password);

      // Generate a JWT token for the new user
      const token = generateJWTToken(newUser);

      // Return the user and token in the response
      return res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error("Signup error:", error);
      return res
        .status(500)
        .json({ message: "Signup failed. Please try again later." });
    }
  }

  static async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user with the given email exists
      const user = await getUserByEmailSvc(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Validate the password
      const isValidPass = await bcrypt.compare(password, user.password);
      if (!isValidPass) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate a JWT token for the authenticated user
      const token = generateJWTToken(user);

      delete user.password;

      // Return the user and token in the response
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ message: "Login failed. Please try again later." });
    }
  }
}
