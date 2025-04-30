import React from "react";
import prisma from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaTag,
  FaInfoCircle,
} from "react-icons/fa";
import ImageCarousel from "../../components/ImageCarousel";

export default async function ListingPage({params}: {params: Promise<{ id: string }>}) {
  const listingId = (await params).id;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { owner: true }
  });

  if (!listing) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <Link
          href="/listings"
          className="flex items-center text-indigo-600 mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to listings
        </Link>

        {/* Image Carousel at Top */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {listing.images && listing.images.length > 0 ? (
            <ImageCarousel images={listing.images} title={listing.title} />
          ) : (
            <div className="bg-gray-200 h-96 w-full flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        {/* Listing Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {listing.title}
          </h1>

          <div className="flex items-center space-x-4 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              {listing.category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
              {listing.condition}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{listing.description}</p>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-start">
              <FaTag className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Trade Preference
                </h3>
                <p className="text-gray-800">
                  {listing.tradePreference || "Open to offers"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-800">
                  {listing.location || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaInfoCircle className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Listed by</h3>
                <p className="text-gray-800">
                  {listing.owner.name || "Anonymous"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Make Offer Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaExchangeAlt className="mr-2 text-indigo-600" /> Make an Offer
          </h2>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="offer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                What are you offering?
              </label>
              <textarea
                id="offer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe what you'd like to trade for this item..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
            >
              Submit Offer
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            By submitting, you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Similar Listings Section */}
        <section className="mt-8">
          {/* Similar Listings */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Similar Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Example similar listing - replace with actual data */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Item image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Vintage Camera
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">Photography</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Looking for: Lenses
                    </span>
                    <button className="text-indigo-600 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Item image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Designer Handbag
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">Fashion</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Looking for: Jewelry
                    </span>
                    <button className="text-indigo-600 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
