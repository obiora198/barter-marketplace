"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Conversation {
  id: string;
  offerId?: string;
  listingId?: string;
  offererId?: string;
  ownerId?: string;
  createdAt: string;
  otherUser: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  lastMessage?: {
    text: string;
    createdAt: string;
  };
  unreadCount?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string; // Changed from string | undefined to optional
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <aside className="w-full h-full bg-white rounded-md">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No conversations yet</p>
          <p className="text-sm mt-1">Start a conversation from a listing</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-y-auto">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <button
                onClick={() => onSelect(conv.id)}
                className={`w-full text-left p-3 transition-colors duration-150 ${
                  conv.id === selectedId
                    ? "bg-indigo-50 border-l-4 border-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  {conv.otherUser.image && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={conv.otherUser.image}
                        alt={conv.otherUser.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.otherUser.name || conv.otherUser.email}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { 
                            addSuffix: true 
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage?.text || "No messages yet"}
                      </p>
                      {conv.unreadCount && conv.unreadCount > 0 ? (
                        <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}