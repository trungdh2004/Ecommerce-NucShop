import { Server } from "socket.io";
import { socketChat } from "./socketChat.service";

let io: Server; // Biến để lưu trữ đối tượng io
const listUser = new Map();
const listAdmin = new Map();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL!, "http://127.0.0.1:5500"],
    },
  }); // Khởi tạo đối tượng io với server
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role;


    if (role === "admin") {
      if (listUser.has(userId)) {
        listUser.get(userId).push(socket.id);
      } else {
        listUser.set(userId, [socket.id]);
      }
      if (listAdmin.has(userId)) {
        listAdmin.get(userId).push(socket.id);
      } else {
        listAdmin.set(userId, [socket.id]);
      }
    } else {
      if (listUser.has(userId)) {
        listUser.get(userId).push(socket.id);
      } else {
        listUser.set(userId, [socket.id]);
      }
    }
    socketChat(socket,io)

   

    socket.emit("returnSocket", socket.id);
    socket.on("disconnect",(dataUser) => {
      removeSocketFromUser(userId as string,socket.id);
      removeSocketFromAdmin(userId as string,socket.id);
    })


  });


  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getSocket = (userId: string) => {
  if (!userId) return null;
  const socket = listUser.get(userId);
  return socket;
};

export const getFullSocketAdmin = () => {
  const valuesIterator = listAdmin.values();
  // Chuyển đổi từ Iterator sang mảng
  const valuesArray = Array.from(valuesIterator);
  const listSocket = valuesArray?.flat().map(String)
  return listSocket;
};


function removeSocketFromUser(userId:string, socketId:string) {
  if (listUser.has(userId)) {
    const sockets = listUser.get(userId);
    const index = sockets.indexOf(socketId);
    if (index !== -1) {
      sockets.splice(index, 1);
      if (sockets.length === 0) {
        listUser.delete(userId);
      }
    }
  }
}
function removeSocketFromAdmin(userId:string, socketId:string) {
  if (listAdmin.has(userId)) {
    const sockets = listAdmin.get(userId);
    const index = sockets.indexOf(socketId);
    if (index !== -1) {
      sockets.splice(index, 1);
      if (sockets.length === 0) {
        listAdmin.delete(userId);
      }
    }
  }
}