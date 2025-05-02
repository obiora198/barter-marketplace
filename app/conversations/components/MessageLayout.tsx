"use client";

import React, { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Conversation } from "@/types/types";

export default function MessageLayout() {
  const [selectedId, setSelectedId] = useState<string>('');
  const [showConversations, setShowConversations] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");
        const data = await res.json();
        if (res.ok) {
          setConversations(data);
          // Auto-select first conversation if none selected
          if (!selectedId && data.length > 0) {
            setSelectedId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    if (status === "authenticated") {
      fetchConversations();
    }
  }, [status, selectedId]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated")
    return <div>Please sign in to view messages</div>;

  return (
    <div className="flex flex-col md:flex-row sm:gap-4  h-[calc(100vh-68px)] bg-gray-100 sm:p-4">
      {/* Sidebar (hidden on mobile, shown on md+) */}
      <div className="md:w-80 overflow-y-auto md:block hidden border-r border-gray-50 rounded-md">
        <ConversationList
          conversations={conversations as Conversation[]}
          selectedId={selectedId || undefined}
          onSelect={setSelectedId}
        />
      </div>

      {/* Mobile dropdown trigger for conversations */}
      <div className="md:hidden p-3 bg-white border-b border-gray-200 flex justify-between items-center">
        <button
          onClick={() => setShowConversations((prev) => !prev)}
          className="text-sm font-medium text-indigo-600 flex items-center gap-2"
        >
          {selectedId
            ? conversations.find((c) => c.id === selectedId)?.otherUser.name ||
              "Conversation"
            : "Select Conversation"}
          <svg
            className={`w-4 h-4 transition-transform ${
              showConversations ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile conversation list */}
      {showConversations && (
        <div className="md:hidden absolute z-10 w-full bg-white shadow-lg">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setShowConversations(false);
            }}
          />
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {selectedId ? (
          <ChatWindow
            conversationId={selectedId}
            onBack={() => setShowConversations(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-4 text-center">
            <svg
              className="w-12 h-12 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium mb-1">
              No conversation selected
            </h3>
            <p className="text-sm max-w-xs">
              {conversations.length > 0
                ? "Select a conversation from the list to start chatting"
                : "You don't have any conversations yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
