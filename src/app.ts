import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import logger from "./logger";
import { UserRoutes } from "./routes/user.route";
import { setupSwagger } from "./swagger";
import { registerRoutes } from "./utils/routeUtils";

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

// Use Helmet! for Secure header HTTP requests
app.use(helmet());

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

registerRoutes(app, UserRoutes);

app.use(handleError);

// Call the setupSwagger function to enable Swagger API documentation
setupSwagger(app);

export default app;
