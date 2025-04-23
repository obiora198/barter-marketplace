"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import AuthButton from "./AuthButton";

const Header = () => {
    const { data: session } = useSession();
  return (
    <header>
      <Head>
        <title>TradeHub - Barter Marketplace</title>
        <meta name="description" content="Trade goods without money" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold text-indigo-600 flex items-center gap-2"
        >
          Barter{" "}
          <span className="text-xs text-gray-900 font-light">Marketplace</span>
        </Link>

        <div className="flex items-center space-x-4">
          <SearchBar />
          <Link
            href="/create-listing"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Post Listing
          </Link>
          {!session ? (
            <Link
              href={"/signin"}
              className="text-gray-600 hover:text-indigo-600"
            >
              sign in
            </Link>
          ) : (
            <>
              {/* <Link
                href={"/profile"}
                className="text-gray-600 hover:text-indigo-600"
              >
                {session.user.name}
              </Link> */}
              <AuthButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
