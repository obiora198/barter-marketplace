// app/listings/[id]/page.tsx
import React from "react";
import prisma from "../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaTag,
  FaInfoCircle,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import ImageCarousel from "../components/ImageCarousel";

interface Props {
  params: { id: string };
}

export default async function ItemPage({ params }: Props) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
    },
  });

  if (!listing) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
          Barter <span className="text-xs text-gray-900 font-light">Marketplace</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/create-listing" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Post Listing
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/browse" className="flex items-center text-indigo-600 hover:underline">
            <FaArrowLeft className="mr-2" /> Back to listings
          </Link>
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-indigo-600">
              <FaHeart className="text-xl" />
            </button>
            <button className="text-gray-500 hover:text-indigo-600">
              <FaShare className="text-xl" />
            </button>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {listing.images && listing.images.length > 0 ? (
            <ImageCarousel images={listing.images} title={listing.title} />
          ) : (
            <div className="bg-gray-200 h-96 w-full flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        {/* Listing Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
              <p className="text-indigo-600 font-medium">Posted 2 days ago</p>
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                {listing.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                {listing.condition}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="w-1/3 text-gray-500">Trade Preference</div>
              <div className="w-2/3 font-medium">{listing.tradePreference || "Flexible"}</div>
            </div>
            <div className="flex">
              <div className="w-1/3 text-gray-500">Location</div>
              <div className="w-2/3 font-medium">{listing.location || "Not specified"}</div>
            </div>
            <div className="flex">
              <div className="w-1/3 text-gray-500">Listed by</div>
              <div className="w-2/3 font-medium">
                {listing.owner.name || "Anonymous"}
                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Member since 2023
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Make Offer Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaExchangeAlt className="mr-2 text-indigo-600" /> Make an Offer
          </h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to trade?
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the item you're offering..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any additional details..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-150 shadow-sm"
            >
              Send Trade Offer
            </button>
          </form>
        </div>

        {/* Similar Listings */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Example similar listing - replace with actual data */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Item image</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Vintage Camera</h3>
                <p className="text-gray-500 text-sm mb-2">Photography</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Looking for: Lenses</span>
                  <button className="text-indigo-600 text-sm font-medium">View</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Item image</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">Designer Handbag</h3>
                <p className="text-gray-500 text-sm mb-2">Fashion</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Looking for: Jewelry</span>
                  <button className="text-indigo-600 text-sm font-medium">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>© {new Date().getFullYear()} Barter Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}