import { config } from "dotenv";

config();

import app from "./app";
import { port } from "./config";
import { initializeDataSource } from "./orm/dbConnection";

async function start() {
  try {
    initializeDataSource();
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();
