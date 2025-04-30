import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';

interface ListingCardProps {
  listing: {
    id: number | string;
    title: string;
    description: string;
    images?: string[];
    owner?: { name: string }; // or string if simplified
    category: string;
    condition?: string;
    location?: string | null;
    tradePreference?: string | null;
  };
  variant?: 'full' | 'compact';
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ListingCard({ listing, variant = 'full' }: ListingCardProps) {
  const showMeta = variant === 'full';
  const showDescriptionLines = variant === 'full' ? 'line-clamp-2' : 'line-clamp-1';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200 h-full flex flex-col">
        {/* Image */}
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

        {/* Content */}
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
            {listing.title}
          </h3>
          <p className={`text-gray-600 text-sm mb-3 ${showDescriptionLines}`}>
            {listing.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {listing.category}
            </span>
            {listing.condition && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {listing.condition}
              </span>
            )}
          </div>

          {/* Meta Info (only if full variant) */}
          {showMeta && (
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                <span className="truncate">
                  {listing.location || 'Location not specified'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaTag className="mr-1" />
                <span>Seeking: {listing.tradePreference || 'Anything'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
