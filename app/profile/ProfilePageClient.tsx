// app/profile/ProfilePageClient.tsx
'use client';

import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ListingsGrid from './components/ListingsGrid';
import { User } from '../../types/types';
import { useRouter } from 'next/navigation';

export default function ProfilePageClient({ user }: { user: User }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleEdit = (listingId: string) => {
    // Navigate to edit page
    router.push(`/listings/${listingId}/edit`);
  };

  const handleDelete = async (listingId: string) => {
    setLoading(true);
    // Handle listing deletion (e.g., API call to delete)
    const response = await fetch(`/api/listings/${listingId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      // Optionally re-fetch listings or update local state to reflect changes
      alert('Listing deleted');
    } else {
      alert('Failed to delete the listing');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader 
        user={user} 
        listingsCount={user.listings.length} 
      />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Listings</h2>
        <ListingsGrid 
        listings={user.listings} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading} 
      />
      </div>
    </div>
  );
}