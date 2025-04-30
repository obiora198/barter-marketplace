import React, { useState } from 'react';
import { Listing } from '../../../types/types';
import ListingCard from '../../components/ListingCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Link from 'next/link';

interface ListingsGridProps {
  listings: Listing[];
  loading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ListingsGrid({ 
  listings,
  loading,
  onEdit,
  onDelete
}: ListingsGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  const handleDeleteClick = (listing: Listing) => {
    setListingToDelete(listing);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (listingToDelete && onDelete) {
      onDelete(listingToDelete.id);
    }
    setIsModalOpen(false);
    setListingToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setListingToDelete(null);
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Link href={'/create-listing'}>Post your first listing</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="relative group">
          <ListingCard listing={listing} variant='compact' onEdit={() => onEdit?.(listing.id)} />
          
          {/* Hover buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2 z-10">
            {onEdit && (
              <button
                onClick={() => onEdit(listing.id)}
                className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 text-xs px-2 py-1 rounded"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => handleDeleteClick(listing)}
                className="bg-white text-red-600 border border-red-600 hover:bg-red-50 text-xs px-2 py-1 rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        listingTitle={listingToDelete?.title || ''}
      />
    </div>
  );
}
