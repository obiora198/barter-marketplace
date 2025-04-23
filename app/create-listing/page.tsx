"use client";
import React, { useRef } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import ImageGrid from "../components/ImageGrid";

export default function CreateListing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

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

  // Categories consistent with your homepage
  const categories = [
    "Electronics",
    "Home & Garden",
    "Books",
    "Clothing",
    "Toys",
    "Tools",
    "Sports Equipment",
    "Furniture",
    "Collectibles",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setRawFiles((prev) => [...prev, ...files]);

    // Clean up object URLs later to prevent memory leaks
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });
  };

  // If you want to also reset the actual input value (optional)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Optional: Function to remove an image from the preview and raw files
  const clearAllImages = () => {
    setPreviews([]);
    setRawFiles([]);

    

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value
    }
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return;
  //   const files = Array.from(e.target.files);

  //   try {
  //     const uploadedUrls = await Promise.all(
  //       files.map(async (file) => {
  //         const formData = new FormData();
  //         formData.append("file", file);
  //         formData.append("upload_preset", "ml_default"); // Replace with your actual preset

  //         const res = await fetch(
  //           "https://api.cloudinary.com/v1_1/dgd3z5vbo/image/upload",
  //           {
  //             method: "POST",
  //             body: formData,
  //           }
  //         );

  //         const data = await res.json();
  //         return data.secure_url;
  //       })
  //     );

  //     setFormData((prev) => ({
  //       ...prev,
  //       images: [...prev.images, ...uploadedUrls],
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to upload images");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    if (!session) {
      setError("You must be logged in to create a listing");
      setIsSubmitting(false);
      return;
    }
  
    // Upload images to /api/upload
    const imageUploadForm = new FormData();
    rawFiles.forEach((file) => {
      imageUploadForm.append("files", file);
    });
  
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: imageUploadForm,
    });
    
    
    const { urls } = await uploadRes.json(); // Assuming this returns { urls: [...] }
    console.log("Upload response:", urls);
  
    // Prepare data to send to /api/listings
    const listingData = {
      ...formData, // This should be your local form state with fields like title, desc, etc.
      images: urls,
      userId: session.user.id,
    };
  
    try {
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
      router.push(`/listings/${result.id}`);
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

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm rounded-lg p-6"
        >
          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What are you offering?"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your item in detail (condition, features, etc.)"
            />
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images *
            </label>
            <ImageGrid
              images={previews}
              setImages={(imgs) => {
                // Optional: reordering logic
                const newOrder = imgs.map((url) => previews.indexOf(url));
                const newRawFiles = newOrder.map((i) => rawFiles[i]);
                setPreviews(imgs);
                setRawFiles(newRawFiles);
              }}
            />
            {previews.length > 0 && (
              <div className="my-4">
                <button
                  disabled={isSubmitting}
                  onClick={clearAllImages}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-400"
                >
                  Clear All
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {formData.images?.length < 8 && (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm text-gray-500 mt-1">Add photos</span>
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload up to 8 photos. First image will be the main photo.
            </p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="new">Brand New</option>
              <option value="excellent">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Trade Preference */}
          <div className="mb-6">
            <label
              htmlFor="tradePreference"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What would you like in trade?
            </label>
            <input
              type="text"
              id="tradePreference"
              name="tradePreference"
              value={formData.tradePreference}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Gardening tools, books, electronics"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location (City, State)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Where is the item located?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
