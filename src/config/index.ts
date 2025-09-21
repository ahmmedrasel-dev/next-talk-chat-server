import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  cors_origin: process.env.CORS_ORIGIN,
  client_url: process.env.CLIENT_URL,
  database_url: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  refresh_token_secret: process.env.REFRESH_SECRET,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
};
