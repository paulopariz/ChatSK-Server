import { io } from "./http";

io.on("connection", (socket) => {
  console.log("Client - ", socket.id);
});
