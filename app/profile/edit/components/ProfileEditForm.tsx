"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../../../lib/validation/validatorSchema";
import { FiEdit, } from 'react-icons/fi';

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  initialData: {
    name: string;
    bio?: string;
    location?: string;
    imageUrl?: string;
  };
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProfileEditForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const [preview, setPreview] = useState(initialData.imageUrl || "/user.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (formValues: ProfileFormData) => {
    try {
      let imageUrl = formValues.imageUrl;

      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("files", imageFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data?.urls?.[0]) throw new Error("Upload failed");

        imageUrl = data.urls[0];
      }

      await onSubmit({
        ...formValues,
        imageUrl,
      });
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Profile Image</label>

        <div className="relative inline-block w-20 h-20 mb-2">
          {preview && (
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                <FiEdit className="text-white w-5 h-5" />
              </div>
            </label>
          )}
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          {...register("bio")}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          {...register("location")}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : isSubmitting
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}
