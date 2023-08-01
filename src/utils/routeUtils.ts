// utils/routeUtils.ts
import { Express, NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware";

export function registerRoutes(app: Express, routes: any[]) {
  routes.forEach((route) => {
    const method = route.method.toLowerCase();
    if (route.protected) {
      app[method](
        route.path,
        authMiddleware,
        ...route.validation,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const result = await route.handler(req, res, next);
            // If the route handler does not send a response, send the result
            if (!res.headersSent) {
              res.json(result);
            }
          } catch (err) {
            next(err);
          }
        }
      );
    } else {
      app[method](
        route.path,
        ...route.validation,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }

            const result = await route.handler(req, res, next);
            // If the route handler does not send a response, send the result
            if (!res.headersSent) {
              res.json(result);
            }
          } catch (err) {
            next(err);
          }
        }
      );
    }
  });
}
