import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./routes/user.route";
import { validationResult } from "express-validator";
import logger from "./logger";
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware";
import { rateLimit } from "express-rate-limit";
import { setupSwagger } from "./swagger";

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

// Use the cors middleware
app.use(cors());

// Implement rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP within the windowMs
});

// Apply the rate limiter to all requests
app.use(limiter);

UserRoutes.forEach((route) => {
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

app.use(handleError);

// Call the setupSwagger function to enable Swagger API documentation
setupSwagger(app);

export default app;
