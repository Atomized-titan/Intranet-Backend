import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { Routes } from "./router/user.router";
import { validationResult } from "express-validator";
import logger from "./logger";

function logRequest(req: Request, _res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  next();
}
function handleError(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err); // Log the error using Winston logger
  res.status(err.statusCode || 500).json({ error: err.message });
}

const app = express();
// app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(logRequest); // Log incoming requests

Routes.forEach((route) => {
  const method = route.method.toLowerCase();
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
});

app.use(handleError);

export default app;
