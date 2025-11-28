import { RefreshCw } from 'react-feather';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function RefreshButton({
  onRefresh,
  isLoading = false,
  className = '',
}: RefreshButtonProps) {
  return (
    <button
      className={`btn flex gap-2 w-full sm:w-auto justify-center ${className}`}
      onClick={onRefresh}
      disabled={isLoading}
    >
      <RefreshCw className={isLoading ? 'animate-spin' : ''} /> Refresh
    </button>
  );
}
