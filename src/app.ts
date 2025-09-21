import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import config from "./config";

const app: Application = express();

// Middleware
app.use(cors({ origin: config.client_url as string }));
app.use(cookieParser());
app.use(express.json());

// Rate limiting middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// API versioning
app.use("/api/v1/users", userRoutes);

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io server
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

// // Socket.io connection
// io.on("connection", (socket) => {
//   console.log("New client connected: ", socket.id);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected: ", socket.id);
//   });
// });

export default app;
