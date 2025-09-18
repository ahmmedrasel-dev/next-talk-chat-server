import mongoose from "mongoose";
import config from ".";

const connectDB = async () => {
  try {
    await mongoose.connect(config.database_url as string);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
