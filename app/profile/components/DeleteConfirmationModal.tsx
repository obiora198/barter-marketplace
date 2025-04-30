import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingTitle: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  listingTitle
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">Are you sure you want to delete the listing "{listingTitle}"?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
