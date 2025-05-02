import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Message } from "../../types/types";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: Server;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/ws",
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("joinConversation", (conversationId: string) => {
        socket.join(conversationId);
        console.log(`Joined conversation: ${conversationId}`);
      });

      socket.on("newMessage", (message: Message) => {
        io.to(message.conversationId).emit("messageReceived", message);
      });

      socket.on("typing", (data) => {
        socket.to(data.conversationId).emit("userTyping", data);
      });
    });
  }

  res.end();
}
