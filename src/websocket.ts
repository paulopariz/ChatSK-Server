import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Room {
  name: string;
  owner: string;
  createAt: Date;
}

interface Message {
  room: string;
  text: string;
  createAt: Date;
  username: string;
}

const users: RoomUser[] = [];

const messages: Message[] = [];

const rooms: any[] = [];

io.on("connection", (socket) => {
  function createRoom(room: Room): boolean {
    const roomExists = rooms.some((room) => room.name === room);

    room.createAt = new Date();
    if (!roomExists) {
      rooms.push(room);

      io.emit("room_list", getRoomList());
      return true;
    }

    return false;
  }

  function getRoomList() {
    return rooms.map((room) => room);
  }

  socket.on("create_room", (data, callback) => {
    const roomCreated = createRoom(data);

    if (roomCreated) {
      socket.join(data);
      callback({
        success: true,
        data: {
          name: data.name,
          owner: data.owner,
          createAt: new Date(),
        },
      });

      io.emit("room_list_update");
    } else {
      callback({ success: false, message: `A sala ${data.room} já existe.` });
    }
  });

  socket.on("list_rooms", (callback) => {
    const roomList = getRoomList();

    callback(roomList);
  });

  socket.on("select_room", (data, callback) => {
    if (!data) {
      return;
    }
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {
    //salvar mensagens
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createAt: new Date(),
    };

    messages.push(message);

    //enviar mensagem para os usuario da sala
    io.to(data.room).emit("message", message);
  });
});

function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter((msg) => msg.room === room);

  return messagesRoom;
}
