import { ReactNode, useState } from 'react';
import { Loader, X } from 'react-feather';

import Modal from './Modal';

interface FormModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  children: ReactNode;
  submitLabel?: string;
}

export default function FormModal({
  show,
  title,
  onClose,
  onSubmit,
  isSubmitting,
  children,
  submitLabel = 'Save',
}: FormModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal show={show}>
      <div className="flex">
        <h1 className="font-semibold mb-3">{title}</h1>
        <button className="ml-auto focus:outline-none" onClick={handleClose}>
          <X size={30} />
        </button>
      </div>
      <hr />

      <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
        {children}
        <button className="btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader className="animate-spin mx-auto" />
          ) : (
            submitLabel
          )}
        </button>
        {error && (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}
