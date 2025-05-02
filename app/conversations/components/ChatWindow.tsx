"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, User } from "@/types/types";
import { useSession } from "next-auth/react";
import MessageInput from "./MessageInput";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import io from "socket.io-client";

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
}

export default function ChatWindow({
  conversationId,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io({
      path: "/api/ws",
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit("joinConversation", conversationId);

    // Set up message listener
    socket.on("messageReceived", (message: Message) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            (m.id && m.id === message.id) || // exact match by ID
            (!m.id &&
              m.senderId === message.senderId &&
              m.text === message.text) // optimistic match
        );

        if (isDuplicate) return prev;

        // Optionally: remove matching optimistic message before adding the real one
        const filtered = prev.filter(
          (m) =>
            !(
              // remove if:
              (
                !m.id &&
                m.senderId === message.senderId &&
                m.text === message.text
              )
            )
        );

        return [...filtered, message];
      });
    });

    // Set up typing indicator listener
    socket.on("userTyping", (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== session?.user.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("messageReceived");
      socket.off("userTyping");
    };
  }, [socket, conversationId, session]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const messagesRes = await fetch(`/api/conversations/${conversationId}`);

        if (!messagesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const messagesData = await messagesRes.json();

        setMessages(messagesData.messages);
        setOtherUser(messagesData.otherUser);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session && conversationId) {
      fetchInitialData();
    }
  }, [conversationId, session]);

  const handleNewMessage = (newMessage: Message) => {
    // Optimistically update UI
    setMessages((prev) => [...prev, newMessage]);

    socket?.emit("newMessage", newMessage);
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && conversationId && session?.user.id) {
      socket.emit("typing", {
        conversationId,
        userId: session.user.id,
        isTyping,
      });
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session) return <div>Please sign in to view messages</div>;
  return (
    <div className="flex-1 flex flex-col h-full rounded-md">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {otherUser && (
            <div className="flex items-center">
              {otherUser.image && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                  <Image
                    src={otherUser.image}
                    alt={otherUser.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="font-medium text-gray-900">
                {otherUser.name || otherUser.email}
              </h2>
            </div>
          )}
        </div>
        {isTyping && (
          <div className="text-sm text-gray-500 italic">
            {otherUser?.name || "User"} is typing...
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={msg.id || `temp-${index}`}
            className={`p-2 rounded-lg max-w-xs ${
              msg.senderId === session.user.id
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-100 self-start mr-auto"
            }`}
          >
            <div className="text-sm text-gray-700">{msg.text}</div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(msg.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <MessageInput
          conversationId={conversationId}
          onMessageSent={handleNewMessage}
          onTyping={handleTyping}
          currentUser={session.user.id}
        />
      </div>
    </div>
  );
}
