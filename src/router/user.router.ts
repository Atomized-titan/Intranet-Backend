// users.routes.ts
import express from "express";
import { getAllUsers } from "../controllers/users.controllers";

const router = express.Router();

// Define the route
router.get("/", getAllUsers);

export default router;
