// types/index.ts
export interface Listing {
    id: string;
    title: string;
    description: string;
    images: string[];
    category: string;
    condition: string | "good";
    tradePreference: string | null;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string | null;
    location?: string | null;
    listings: Listing[];
  }

  export interface Message {
    id: string;
    text: string;
    senderId: string;
    conversationId: string;
    createdAt: string;
    sender: Partial<User>;
  }
  
  export interface Conversation {
    id: string;
    otherUser: User;
    lastMessage?: {
      id: string;
      text: string;
      createdAt: string;
    };
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
  }