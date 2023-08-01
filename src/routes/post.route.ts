// post.routes.ts
import { body, param } from "express-validator";
import { PostController } from "../controllers/post.controllers";

const BASE_PATH = "/posts";
const POST_ID_PATH = "/:id";

export interface PostRouteProps {
  method: string;
  path: string;
  handler: any;
  action?: string;
  validation?: any[];
  protected?: boolean;
}

export const PostRoutes: PostRouteProps[] = [
  {
    method: "get",
    path: BASE_PATH,
    handler: PostController.getAllPosts,
    action: "all",
    validation: [],
  },
  {
    method: "get",
    path: `${BASE_PATH}${POST_ID_PATH}`,
    handler: PostController.getPostById,
    action: "one",
    validation: [param("id").isInt()],
  },
  {
    method: "post",
    path: BASE_PATH,
    handler: PostController.createPost,
    action: "save",
    validation: [body("content").isString().notEmpty()],
    protected: true, // Requires authentication to create a post
  },
  {
    method: "patch",
    path: `${BASE_PATH}${POST_ID_PATH}`,
    handler: PostController.updatePost,
    action: "update",
    validation: [param("id").isInt(), body("content").isString().notEmpty()],
    protected: true, // Requires authentication to update a post
  },
  {
    method: "delete",
    path: `${BASE_PATH}${POST_ID_PATH}`,
    handler: PostController.deletePost,
    action: "delete",
    validation: [param("id").isInt()],
    protected: true, // Requires authentication to delete a post
  },
];
