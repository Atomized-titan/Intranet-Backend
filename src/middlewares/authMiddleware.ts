import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { Request } from "../interfaces/customTypes";
// Replace this with the path to your jwt secret file

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    req.userId = decoded.userId; // Save the user id to the request object for further use in route handlers
    next();
  } catch (err) {
    console.log("Error decoding token:", err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};
