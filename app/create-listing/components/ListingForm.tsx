// components/ListingForm.tsx
import React, { useState, useRef } from "react";
import ImageGrid from "../../components/ImageGrid";
import { Listing } from "../../../types/types";

interface ListingFormProps {
  initialData?: Partial<Listing>;
  onSubmit: (data: any, rawImages: File[]) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
}

export default function ListingForm({
  initialData = {},
  onSubmit,
  isSubmitting,
  error,
}: ListingFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previews, setPreviews] = useState<string[]>(initialData.images || []);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "",
    condition: initialData.condition || "good",
    images: initialData.images || [],
    tradePreference: initialData.tradePreference || "",
    location: initialData.location || "",
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return url;
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
    setRawFiles((prev) => [...prev, ...files]);
  };

  const clearAllImages = () => {
    setPreviews([]);
    setRawFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null); // Reset upload error state before submitting
    await onSubmit(formData, rawFiles);
  };

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

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white shadow-sm rounded-lg p-6"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError}
        </div>
      )}

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
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
