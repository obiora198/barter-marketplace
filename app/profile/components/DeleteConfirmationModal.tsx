interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingTitle: string;
  loading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
  loading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the listing "{listingTitle}"?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
