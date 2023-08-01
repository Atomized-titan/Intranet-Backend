// swagger.ts
import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app: Application) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Your API Documentation",
        version: "1.0.0",
        description: "API documentation for your application",
      },
      servers: [
        {
          url: "http://localhost:3000", // Replace with your server URL
        },
      ],
    },
    apis: ["./src/routes/*.route.ts"], // Replace with the path to your router files
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
