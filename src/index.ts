import app from "./app";
import { port } from "./config";
import { init } from "./db/database";

async function start() {
  try {
    init();
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();
