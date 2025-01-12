import { Socket, Server } from "socket.io";

interface IMessage {
  conversation: string;
  content: string;
  sender: string;
  read: string[];
  user: string;
}

export function socketChat(socket: Socket, io: Server) {
  socket.on("joinChat", (id) => {
    socket.join(id);
  });

  socket.on("getRoomMembers", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      const members = Array.from(room); // Chuyển thành mảng để dễ quản lý
      socket.emit("roomMembers", members); // Gửi danh sách socket ID cho client
    } else {
      socket.emit("roomMembers", []); // Phòng không tồn tại
    }
  });

  socket.on("newMessage", (message: IMessage, conversation) => {
    console.log("newMessage",message);
    
    if (message?.conversation) {
      console.log("Chuyển vào phòng", conversation);
      socket.to(message?.conversation).emit("messageSender", message);
      io.emit("updateConversation", conversation);
    }
    const room = io.sockets.adapter.rooms.get(message?.conversation);
    if (room) {
      const members = Array.from(room); // Chuyển thành mảng để dễ quản lý
      socket.emit("roomMembers", members); // Gửi danh sách socket ID cho client
      console.log("members",members);
      
    } else {
      socket.emit("roomMembers", []); // Phòng không tồn tại
    }
  });

  socket.on("leaveRoom", (id) => {
    socket.leave(id);
  });
}
