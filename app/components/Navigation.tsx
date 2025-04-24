"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import AuthButton from "./AuthButton";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-4 sm:px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-indigo-600 flex flex-col sm:flex-row items-center sm:gap-2"
          >
            Barter{" "}
            <span className="text-xs text-gray-900 font-light">
              Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-64 lg:w-80">
              <SearchBar />
            </div>
            <Link
              href="/create-listing"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 whitespace-nowrap"
            >
              Post Listing
            </Link>
            {!session ? (
              <Link
                href={"/signin"}
                className="text-gray-600 hover:text-indigo-600 whitespace-nowrap"
              >
                Sign In
              </Link>
            ) : (
              <AuthButton />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="px-2">
              <SearchBar />
            </div>
            <div className="flex flex-col space-y-2 px-2">
              <Link
                href="/create-listing"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Post Listing
              </Link>
              {!session ? (
                <Link
                  href={"/signin"}
                  className="px-4 py-2 text-gray-600 hover:text-indigo-600 text-center border rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <div className="px-2" onClick={() => setIsMenuOpen(false)}>
                  <AuthButton />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;