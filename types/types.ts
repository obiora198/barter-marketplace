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
    name: string | null;
    email: string | null;
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    listings: Listing[];
  }