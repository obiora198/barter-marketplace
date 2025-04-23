import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '../../../types/types';

interface ListingsGridProps {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingsGrid({ 
  listings,
  emptyMessage = "No listings found" 
}: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link 
          key={listing.id} 
          href={`/listings/${listing.id}`}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
        >
          <div className="relative h-48 w-full">
            {listing.images?.[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 truncate">{listing.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              {listing.category}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}