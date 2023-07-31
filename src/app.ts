import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { Routes } from "./router/user.router";
import { validationResult } from "express-validator";
import logger from "./logger";

function handleError(err, _req, res, _next) {
  logger.error(err); // Log the error using Winston logger
  res.status(err.statusCode || 500).send(err.message);
}

const app = express();
// app.use(morgan('tiny'));
app.use(bodyParser.json());

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
