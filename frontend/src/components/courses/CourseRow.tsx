import { Link } from 'react-router-dom';

import Course from '../../models/course/Course';
import TableItem from '../shared/TableItem';
import EnrolledUsersModal from './EnrolledUsersModal';
import EnrollmentBadge from './EnrollmentBadge';
import EnrollmentButton from './EnrollmentButton';

interface CourseRowProps {
  course: Course;
  role: string;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onEnrollmentChange: () => void;
}

export default function CourseRow({
  course,
  role,
  onEdit,
  onDelete,
  onEnrollmentChange,
}: CourseRowProps) {
  const {
    id,
    name,
    description,
    dateCreated,
    isEnrolled,
    enrolledCount,
  } = course;
  const isAdmin = role === 'admin';
  const isEditor = role === 'editor';
  const isUser = role === 'user';

  return (
    <tr>
      <TableItem>
        <Link to={`/courses/${id}`}>{name}</Link>
      </TableItem>
      <TableItem>{description}</TableItem>
      <TableItem>{new Date(dateCreated).toLocaleDateString()}</TableItem>
      {isUser && (
        <TableItem>
          <EnrollmentBadge isEnrolled={isEnrolled} />
        </TableItem>
      )}
      <TableItem className="text-right">
        {isUser && (
          <EnrollmentButton
            courseId={id}
            isEnrolled={isEnrolled}
            onSuccess={onEnrollmentChange}
          />
        )}
        {isAdmin && (
          <EnrolledUsersModal
            courseId={id}
            enrolledCount={enrolledCount || 0}
          />
        )}
        {(isAdmin || isEditor) && (
          <button
            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
            onClick={() => onEdit(course)}
          >
            Edit
          </button>
        )}
        {isAdmin && (
          <button
            className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        )}
      </TableItem>
    </tr>
  );
}
