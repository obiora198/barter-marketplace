'use client';

import React from 'react'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast'

export default function OfferForm({ listingId }: { listingId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            listingId: listingId, 
            initialMessage: message
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setMessage("");
      toast.success('message sent')
      router.refresh(); // reload the page or use mutation to update state
    } catch (err) {
      console.error(err);
      toast.error("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
      >
        {loading ? "Sending..." : "Submit Offer"}
      </button>
    </form>
  );
}
