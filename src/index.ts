import app from "./app";
import { init } from "./db/database";

const port = 3000; // Change this to the port you want to use

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
