"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/types/types";
import { JSX } from "react";

interface MessageInputProps {
  conversationId: string;
  onMessageSent?: (message: Message) => void;
  onTyping?: (isTyping: boolean) => void;
}

export default function MessageInput({ 
  conversationId, 
  onMessageSent,
  onTyping 
}: MessageInputProps): JSX.Element { 
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicators
  useEffect(() => {
    if (onTyping) {
      if (text.trim().length > 0) {
        onTyping(true);
        
        // Set timeout to stop typing indicator after 3 seconds of inactivity
        if (typingTimeout.current) {
          clearTimeout(typingTimeout.current);
        }
        
        typingTimeout.current = setTimeout(() => {
          onTyping(false);
        }, 3000);
      } else {
        onTyping(false);
      }
    }

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [text, onTyping]);

  const handleSend = async () => {
    if (!text.trim()) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      const message = {
        text: text.trim(),
        conversationId,
        senderId: "", // Will be set on server
        createdAt: new Date().toISOString(),
      };

      // Call the onMessageSent callback immediately for optimistic update
      if (onMessageSent) {
        onMessageSent({
          ...message,
          id: "temp-" + Date.now(), // Temporary ID
        } as Message);
      }

      // Clear typing indicator
      if (onTyping) {
        onTyping(false);
      }

      // Send to server via API (which will broadcast via WebSocket)
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Failed to send message");
      }

      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Make sure to return JSX
  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-500 text-sm px-2">{error}</div>
      )}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={isSending || !text.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
        >
          {isSending ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}