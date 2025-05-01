'use client'; // 👈 Add this at the top

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileEditForm from "./components/ProfileEditForm";
import { profileSchema } from "../../../lib/validation/validatorSchema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast'
import LoadingScreen from '../../components/LoadingScreen'

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<ProfileFormData | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    const fetchUser = async () => {
      const res = await fetch("/api/profile"); // Create an API route that returns the user
      const data = await res.json();
      console.log(res)
      setUserData({
        name: data.name || "",
        bio: data.bio || "",
        location: data.location || "",
        imageUrl: data.image || "",
      });
    };

    if (status === "authenticated") {
      fetchUser();
    }
  }, [status, router]);

  const handleProfileSubmit = async (formData: ProfileFormData) => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      toast.success('Profile updated successfully')
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  if (!userData) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/profile" className="text-indigo-600 hover:underline">
          &larr; Back to profile
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Profile</h1>
        <p className="text-gray-600">Make changes to your profile below</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ProfileEditForm
        initialData={userData}
        isSubmitting={false}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
}
