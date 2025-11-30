import { useState } from 'react';
import { AlertTriangle, Loader } from 'react-feather';

import Modal from './Modal';

interface DeleteModalProps {
  show: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({
  show,
  title,
  message,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal show={show}>
      <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
      <div className="ml-10">
        <h3 className="mb-2 font-semibold">{title}</h3>
        <hr />
        <p className="mt-2">
          {message || (
            <>
              Are you sure you want to delete this item? All data will be
              permanently removed.
              <br />
              This action cannot be undone.
            </>
          )}
        </p>
      </div>
      <div className="flex flex-row gap-3 justify-end mt-5">
        <button className="btn" onClick={handleClose} disabled={isDeleting}>
          Cancel
        </button>
        <button
          className="btn danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader className="mx-auto animate-spin" /> : 'Delete'}
        </button>
      </div>
      {error && (
        <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 mt-3">
          {error}
        </div>
      )}
    </Modal>
  );
}
