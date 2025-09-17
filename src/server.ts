import connectDB from "./config/db";
import config from "./config";
import app from "./app";

async function main() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

main();
