import express from "express";
import bodyParser from "body-parser";
import { init } from "./db/database";
import userRoutes from "./router/user.router";

const app = express();
const port = 3000; // Change this to the port you want to use

app.use(bodyParser.json());

async function start() {
  try {
    init();
    app.get("/", userRoutes);
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();
