import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";

const app = express();
const serverHttp = http.createServer(app);
const io = new SocketIOServer(serverHttp, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

export { serverHttp, io };
