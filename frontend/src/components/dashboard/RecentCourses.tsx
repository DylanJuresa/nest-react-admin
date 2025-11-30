import { Book, Calendar } from 'react-feather';

import Course from '../../models/course/Course';

interface RecentCoursesProps {
  courses: Course[];
}

export default function RecentCourses({ courses }: RecentCoursesProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card shadow">
      <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
        <Book className="text-indigo-500" />
        Últimos Cursos
      </h2>
      {courses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay cursos disponibles
        </p>
      ) : (
        <div className="divide-y">
          {courses.map((course) => (
            <div
              key={course.id}
              className="py-3 hover:bg-gray-50 transition-colors rounded px-2"
            >
              <h3 className="font-medium text-gray-900">{course.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Calendar size={12} />
                <span>{formatDate(course.dateCreated)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
