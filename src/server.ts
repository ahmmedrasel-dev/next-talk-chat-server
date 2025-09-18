import connectDB from "./config/db";
import config from "./config";
import app from "./app";
import http from "http";
import { Server } from "socket.io";

async function main() {
  try {
    await connectDB();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join room
      socket.on("join", (room) => {
        socket.join(room);
        socket.to(room).emit("user-joined", socket.id);
      });

      // Handle chat message
      socket.on("message", ({ room, message, sender }) => {
        io.to(room).emit("message", { sender, message, time: new Date() });
      });

      // Leave room
      socket.on("leave", (room) => {
        socket.leave(room);
        socket.to(room).emit("user-left", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

main();
