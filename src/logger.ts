import winston from "winston";

// Create a new Winston logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug", // Set the logging level (options: error, warn, info, verbose, debug, silly)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to log entries
    winston.format.json() // Log entries as JSON objects
  ),
  transports: [
    // Define transport for logging to console
    new winston.transports.Console(),
    // Add more transports here if you want to log to files, databases, etc.
  ],
});

export default logger;
