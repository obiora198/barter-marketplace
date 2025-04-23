'use client'
import React from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Check your email</h1>
      <p className="mb-4">
        We've sent a sign-in link to <strong>{email}</strong>
      </p>
      <p>
        Please check your inbox and click the link to complete sign-in.
      </p>
    </div>
  );
}