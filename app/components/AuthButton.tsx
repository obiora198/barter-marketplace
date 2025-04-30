"use client";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
} from "react-icons/fi";

export default function AuthButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src={session.user?.image || "/user.png"}
            alt="User avatar"
            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-indigo-500 transition-colors"
          />
          <span className="text-sm font-medium hidden md:inline">
            {session.user?.name || "Account"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 
                         md:origin-top-right 
                         transform transition-transform duration-100 ease-in-out">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FiUser className="mr-3" />
              Your Profile
            </Link>

            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FiMessageSquare className="mr-3" />
              Messages
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FiSettings className="mr-3" />
              Account Settings
            </Link>

            <div className="border-t border-gray-100"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <FiLogOut className="mr-3" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
    >
      Sign In
    </button>
  );
}