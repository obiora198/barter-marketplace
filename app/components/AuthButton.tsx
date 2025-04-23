"use client";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setClicked(false);
      }
    };

    if (clicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clicked]);

  if (session) {
    return (
      <div
        className="flex items-center gap-4 relative"
        ref={containerRef}
      >
        <div
          onClick={() => setClicked(!clicked)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={session.user?.image || "/user.png"}
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">{session.user?.name || "User"}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Not strictly necessary anymore
            setClicked(false);   // Optional: close dropdown on sign out
            signOut();
          }}
          className={`transition-opacity duration-300 ease-in-out px-4 py-2 bg-red-500 text-white rounded absolute top-10 right-0 ${
            clicked ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
    >
      Sign In
    </button>
  );
}
