import { body, param } from "express-validator";
import { UserController } from "../controllers/users.controllers";

const BASE_PATH = "/users";
const USER_ID_PATH = "/:id";

export const Routes = [
  {
    method: "get",
    path: BASE_PATH,
    handler: UserController.getAllUsers,
    action: "all",
    validation: [],
  },
  {
    method: "get",
    path: `${BASE_PATH}${USER_ID_PATH}`,
    handler: UserController.getUserById,
    action: "one",
    validation: [param("id").isInt()],
  },
  {
    method: "post",
    path: BASE_PATH,
    handler: UserController.addUser,
    action: "save",
    validation: [body("name").isString(), body("email").isEmail()],
  },
  {
    method: "delete",
    path: `${BASE_PATH}${USER_ID_PATH}`,
    handler: UserController.deleteUser,
    action: "delete",
    validation: [param("id").isInt()],
  },
  {
    method: "post",
    path: "/signup",
    handler: UserController.signup,
    validation: [
      body("name").isString(),
      body("email").isEmail(),
      body("password").isLength({ min: 6 }),
    ],
  },
  {
    method: "post",
    path: "/login",
    handler: UserController.login,
    validation: [
      body("email").isEmail(),
      body("password").isLength({ min: 6 }),
    ],
  },
];
