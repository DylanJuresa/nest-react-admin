import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import DeleteModal from '../shared/DeleteModal';
import FormModal from '../shared/FormModal';
import Table from '../shared/Table';
import CourseRow from './CourseRow';

interface CoursesTableProps {
  data: Course[];
  isLoading: boolean;
  refetch: () => void;
}

export default function CoursesTable({
  data,
  isLoading,
  refetch,
}: CoursesTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [updateShow, setUpdateShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    await courseService.delete(selectedCourseId);
    refetch();
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    await courseService.update(selectedCourseId, updateCourseRequest);
    setUpdateShow(false);
    reset();
    refetch();
  };

  const handleEdit = (course: Course) => {
    setSelectedCourseId(course.id);
    setValue('name', course.name);
    setValue('description', course.description);
    setUpdateShow(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedCourseId(id);
    setDeleteShow(true);
  };

  return (
    <>
      <div className="table-container">
        <Table
          columns={
            authenticatedUser.role === 'user'
              ? ['Name', 'Description', 'Created', 'Status']
              : ['Name', 'Description', 'Created']
          }
        >
          {!isLoading &&
            data.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                role={authenticatedUser.role}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onEnrollmentChange={refetch}
              />
            ))}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      <DeleteModal
        show={deleteShow}
        title="Delete Course"
        message="Are you sure you want to delete the course? All of course's data will be permanently removed. This action cannot be undone."
        onClose={() => setDeleteShow(false)}
        onConfirm={handleDelete}
      />

      <FormModal
        show={updateShow}
        title="Update Course"
        onClose={() => {
          setUpdateShow(false);
          reset();
        }}
        onSubmit={handleSubmit(handleUpdate)}
        isSubmitting={isSubmitting}
      >
        <input
          type="text"
          className="input"
          placeholder="Name"
          required
          disabled={isSubmitting}
          {...register('name')}
        />
        <input
          type="text"
          className="input"
          placeholder="Description"
          required
          disabled={isSubmitting}
          {...register('description')}
        />
      </FormModal>
    </>
  );
}
