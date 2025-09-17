import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io server
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// Health Check API
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
});

// // Socket.io connection
// io.on("connection", (socket) => {
//   console.log("New client connected: ", socket.id);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected: ", socket.id);
//   });
// });

export default app;
