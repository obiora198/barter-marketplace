// app/profile/ProfilePageClient.tsx
'use client';

import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ListingsGrid from './components/ListingsGrid';
import { User } from '../../types/types';

export default function ProfilePageClient({ user }: { user: User }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader 
        user={user} 
        listingsCount={user.listings.length} 
      />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Listings</h2>
        <ListingsGrid listings={user.listings} />
      </div>
    </div>
  );
}