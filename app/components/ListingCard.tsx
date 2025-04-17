import React from "react";
import Link from "next/link";

interface ListingCardProps {
  id?: number;
  title: string;
  description: string;
  image: string;
  owner: string;
  category: string;
}

export default function ListingCard({
  title,
  description,
  image,
  owner,
  category
}: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium">{category}</span>
        <h3 className="text-lg font-semibold mt-1 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">by {owner}</span>
          <Link 
            href={`/listings/1`} // Replace with actual listing ID
            className="text-sm text-indigo-600 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}