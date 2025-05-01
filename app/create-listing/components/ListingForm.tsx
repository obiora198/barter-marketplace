// components/ListingForm.tsx
import React, { useState, useRef } from "react";
import ImageGrid from "../../components/ImageGrid";
import { Listing } from "../../../types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/lib/validation/validatorSchema";
import { z } from "zod";

// Infer TypeScript type from Zod schema
type ListingFormData = z.infer<typeof listingSchema>;

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
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      condition: (initialData.condition as ListingFormData["condition"]) || "good",
      tradePreference: initialData.tradePreference || "",
      location: initialData.location || "",
      images: initialData.images || [],
    },
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);
  //   const newPreviews = files.map((file) => {
  //     const url = URL.createObjectURL(file);
  //     setTimeout(() => URL.revokeObjectURL(url), 10000);
  //     return url;
  //   });
  //   setPreviews((prev) => [...prev, ...newPreviews]);
  //   setRawFiles((prev) => [...prev, ...files]);
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return url;
    });

    const newImages = [...previews, ...newPreviews];
    const newRawFiles = [...rawFiles, ...files];

    setPreviews(newImages);
    setRawFiles(newRawFiles);

    setValue("images", newImages); // This updates the form value
    trigger("images"); // Trigger validation manually
  };

  const clearAllImages = () => {
    setPreviews([]);
    setRawFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onValidSubmit = async (data: z.infer<typeof listingSchema>) => {
    setUploadError(null);
    await onSubmit(data, rawFiles);
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
      onSubmit={handleSubmit(onValidSubmit)}
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
          {...register("title")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="What are you offering?"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
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
          {...register("description")}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Describe your item in detail (condition, features, etc.)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
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
          {previews.length < 8 && (
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
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Category */}
      <select
        id="category"
        {...register("category")}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          errors.category
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {errors.category && (
        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
      )}

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
          {...register("condition")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.condition
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
        >
          <option value="">Select condition</option>
          <option value="new">Brand New</option>
          <option value="excellent">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>

        {errors.condition && (
          <p className="mt-1 text-sm text-red-600">
            must select a valid item condition
          </p>
        )}
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
          {...register("tradePreference")}
          placeholder="e.g., Gardening tools, books, electronics"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.tradePreference && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tradePreference.message}
          </p>
        )}
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
          {...register("location")}
          placeholder="Where is the item located?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
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
