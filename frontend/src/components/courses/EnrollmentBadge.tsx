import { CheckCircle } from 'react-feather';

interface EnrollmentBadgeProps {
  isEnrolled: boolean;
}

export default function EnrollmentBadge({ isEnrolled }: EnrollmentBadgeProps) {
  if (isEnrolled) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        <CheckCircle size={14} />
        Inscrito
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
      No inscrito
    </span>
  );
}
