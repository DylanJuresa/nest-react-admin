import { useState } from 'react';
import { Loader } from 'react-feather';
import toast from 'react-hot-toast';

import courseService from '../../services/CourseService';

interface EnrollmentButtonProps {
  courseId: string;
  isEnrolled: boolean;
  onSuccess: () => void;
}

export default function EnrollmentButton({
  courseId,
  isEnrolled,
  onSuccess,
}: EnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      await courseService.enroll(courseId);
      toast.success('Te has inscrito al curso');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al inscribirse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    try {
      setIsLoading(true);
      await courseService.unenroll(courseId);
      toast.success('Te has dado de baja del curso');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al darse de baja');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader className="animate-spin inline" size={16} />;
  }

  if (isEnrolled) {
    return (
      <button
        className="text-orange-600 hover:text-orange-900 focus:outline-none"
        onClick={handleUnenroll}
      >
        Darse de baja
      </button>
    );
  }

  return (
    <button
      className="text-green-600 hover:text-green-900 focus:outline-none"
      onClick={handleEnroll}
    >
      Inscribirse
    </button>
  );
}
