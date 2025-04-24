import React from "react";
import prisma from "../../lib/prisma";
import { Prisma } from "../../prisma/app/generated/prisma/client";
import ListingCard from "./components/ListingCard";
import SearchFilters from "./components/SearchFilters";
import { Listing } from "@/types/types";
import type { Metadata } from 'next';

interface SearchParams {
  category?: string;
  location?: string;
  sort?: 'newest' | 'oldest';
  search?: string;
}

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Resolve the promise if needed
  const resolvedParams = await Promise.resolve(searchParams);
  // Show current filters in UI
  const activeFilters = [
    resolvedParams.category && `Category: ${resolvedParams.category}`,
    resolvedParams.location && `Location: ${resolvedParams.location}`,
    resolvedParams.search && `Search: "${resolvedParams.search}"`,
  ].filter(Boolean);
  // Build the where clause for Prisma query
  const where: Prisma.ListingWhereInput = {
    ...(resolvedParams.category && {
      category: resolvedParams.category,
    }),
    ...(resolvedParams.location && {
      location: {
        contains: resolvedParams.location,
        mode: "insensitive" as const,
      },
    }),
    ...(resolvedParams.search && {
      OR: [
        {
          title: {
            contains: resolvedParams.search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: resolvedParams.search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  // Build the orderBy clause
  const orderBy: Prisma.ListingOrderByWithRelationInput =
    resolvedParams.sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" }; // default: newest first

  // Execute the query
  const listings: Listing[] = await prisma.listing.findMany({
    where,
    orderBy,
    include: { owner: true },
  });

  // Get unique categories and locations for filters
  const categories = await prisma.listing.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  const locations = await prisma.listing.findMany({
    select: { location: true },
    distinct: ["location"],
    where: {
      location: { not: null },
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation (same as your other pages) */}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-indigo-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Browse Listings</h1>
          <p className="text-indigo-100 max-w-2xl">
            Find items you want and offer what you have. Trade without money.
          </p>
        </div>

        {/* Active Filters Bar */}
        {activeFilters.length > 0 && (
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {filter}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <SearchFilters
              categories={categories.map(
                (c: { category: string }) => c.category
              )}
              locations={locations.map(
                (l: { location: string | null }) => l.location!
              )}
              searchParams={resolvedParams}
            />
          </div>

          {/* Listings Grid */}
          <div className="md:w-3/4">
            {/* Sorting Controls */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <span className="text-gray-600">
                  {listings.length} items found
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort by:</span>
                <select
                  defaultValue={resolvedParams.sort || "newest"}
                  className="border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
