"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import ListingForm from "../../../create-listing/components/ListingForm";
import { Listing } from "../../../../types/types";

const EditListing = () => {
  const listingId = useParams().id;
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [listingData, setListingData] = useState<Listing | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchListingData = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}`);
      if (!res.ok) {
        throw new Error("Listing not found");
      }
      const data = await res.json();
      console.log("Fetched listing data:", data);
      setListingData(data);
    } catch (err) {
      setError("Failed to fetch listing data");
    }
  };

  useEffect(() => {
    fetchListingData();
  }, []);

  const handleSubmit = async (formData: any, rawImages: File[]) => {
    setIsSubmitting(true);
    setError("");

    if (!session) {
      setError("You must be logged in to edit a listing");
      setIsSubmitting(false);
      return;
    }

    // Upload images to /api/upload
    const imageUploadForm = new FormData();
    rawImages.forEach((file) => {
      imageUploadForm.append("files", file);
    });

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imageUploadForm,
      });

      const { urls } = await uploadRes.json(); // Assuming this returns { urls: [...] }
      console.log("Upload response:", urls);

      // Prepare data to send to /api/listings
      const { images, ...rest } = formData;

      const newListingData: Listing = {
        ...rest,
        images: urls.length > 0 ? urls : listingData?.images, // Keep existing images if no new ones are uploaded
      };

      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newListingData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      //   router.push(`/listings/${listingId}`);
      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please sign in to edit a listing
        </h2>
        <button
          onClick={() => router.push("/api/auth/signin")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!listingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Listing | Barter Marketplace</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/profile" className="text-indigo-600 hover:underline">
            &larr; Back to profile
          </Link>
          <h1 className="text-3xl font-bold mt-2">Edit Listing</h1>
          <p className="text-gray-600">Make changes to your listing below</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <ListingForm
          initialData={listingData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Listing updated successfully!
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(`/listings/${listingId}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                View Listing
              </button>
              <button
                onClick={() => router.push(`/profile`)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Return to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditListing;
