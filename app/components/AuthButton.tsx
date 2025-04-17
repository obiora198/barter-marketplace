"use client"
// components/AuthButton.tsx
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img 
          src={session.user?.image || ''} 
          alt="User avatar" 
          className="w-8 h-8 rounded-full"
        />
        <span>{session.user?.name}</span>
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }
  
  return (
    <button 
      onClick={() => signIn('google')}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign In with Google
    </button>
  );
}