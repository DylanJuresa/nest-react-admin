import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import Modal from '../shared/Modal';
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
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);
      setDeleteShow(false);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourseId, updateCourseRequest);
      setUpdateShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
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
      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">Delete Course</h3>
          <hr />
          <p className="mt-2">
            Are you sure you want to delete the course? All of course's data
            will be permanently removed.
            <br />
            This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mx-auto animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
            {error}
          </div>
        ) : null}
      </Modal>
      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Update Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            required
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
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
