import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Request } from "../interfaces/customTypes";
import {
  createPostSvc,
  deletePostSvc,
  getAllPostsSvc,
  getPostByIdSvc,
  likePostSvc,
  unlikePostSvc,
  updatePostSvc,
} from "../services/post.service";

export class PostController {
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;
      const authorId = req.userId; // Assuming you have added the authenticated user to the request object

      const newPost = await createPostSvc(content, authorId);
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }

  static async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await getAllPostsSvc();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id, 10);
      const post = await getPostByIdSvc(postId);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const postId = parseInt(req.params.id, 10);
      const { content } = req.body;
      const userId = req.userId; // Assuming you have added the authenticated user to the request object

      const updatedPost = await updatePostSvc(postId, content, userId);
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id, 10);
      const userId = req.userId; // Assuming you have added the authenticated user to the request object

      await deletePostSvc(postId, userId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
  static async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id, 10);
      const userId = req.userId; // Assuming you have added the authenticated user to the request object

      await likePostSvc(postId, userId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
  static async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = parseInt(req.params.id, 10);
      const userId = req.userId; // Assuming you have added the authenticated user to the request object

      console.log({ postId, userId });

      await unlikePostSvc(postId, userId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}
