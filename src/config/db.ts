import mongoose from "mongoose";
import config from ".";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database_url as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
