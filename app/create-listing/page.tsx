// pages/create-listing.tsx
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import ListingForm from "./components/ListingForm";
import {toast} from 'react-hot-toast'

export default function CreateListing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "good",
    images: [] as string[],
    tradePreference: "",
    location: "",
  });

  const handleSubmit = async (formData: any, rawImages: File[]) => {
    setIsSubmitting(true);
    setError("");

    if (!session) {
      setError("You must be logged in to create a listing");
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

      const listingData = {
        ...rest,
        images: urls,
        userId: session.user.id,
      };

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      const result = await response.json();
      toast.success("Listing created successfully!");
      router.push(`/listings/${result.id}`);
      // router.push(`/listings/${result.id}`);


      // Reset the form
      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "good",
        images: [],
        tradePreference: "",
        location: "",
      });
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
          Please sign in to create a listing
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

  return (
    <>
      <Head>
        <title>Create New Listing | Barter Marketplace</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-indigo-600 hover:underline">
            &larr; Back to home
          </Link>
          <h1 className="text-3xl font-bold mt-2">Create New Listing</h1>
          <p className="text-gray-600">List an item you want to trade</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <ListingForm
          onSubmit={async (formData, rawImages) => {
            handleSubmit(formData, rawImages);
          }}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </>
  );
}
