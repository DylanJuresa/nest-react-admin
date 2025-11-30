import { useState } from 'react';
import { Plus } from 'react-feather';
import { useForm } from 'react-hook-form';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import FormModal from '../components/shared/FormModal';
import Pagination from '../components/shared/Pagination';
import RefreshButton from '../components/shared/RefreshButton';
import useAuth from '../hooks/useAuth';
import useFilteredQuery from '../hooks/useFilteredQuery';
import { PaginatedResponse } from '../models/common/Pagination';
import Course from '../models/course/Course';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [addCourseShow, setAddCourseShow] = useState(false);

  const { authenticatedUser } = useAuth();

  const {
    data,
    isLoading,
    isFetching,
    refetch,
    filters,
    updateFilter,
  } = useFilteredQuery<
    PaginatedResponse<Course>,
    { name: string; description: string; page: number; limit: number }
  >({
    queryKey: 'courses',
    queryFn: (filters) => courseService.findAll(filters),
    initialFilters: { name: '', description: '', page: 1, limit: 10 },
  });

  const courses = data?.results ?? [];
  const meta = data?.meta;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    await courseService.save(createCourseRequest);
    setAddCourseShow(false);
    reset();
    refetch();
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Courses</h1>
      <hr />
      <div className="flex flex-col sm:flex-row gap-3 my-5">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Add Course
          </button>
        ) : null}
        <RefreshButton onRefresh={() => refetch()} isLoading={isFetching} />
      </div>

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={filters.description}
            onChange={(e) => updateFilter('description', e.target.value)}
          />
        </div>
      </div>

      <CoursesTable data={courses} isLoading={isLoading} refetch={refetch} />

      {meta && (
        <Pagination
          meta={meta}
          onPageChange={(page) => updateFilter('page', page)}
        />
      )}

      <FormModal
        show={addCourseShow}
        title="Add Course"
        onClose={() => {
          reset();
          setAddCourseShow(false);
        }}
        onSubmit={handleSubmit(saveCourse)}
        isSubmitting={isSubmitting}
      >
        <input
          type="text"
          className="input"
          placeholder="Name"
          disabled={isSubmitting}
          required
          {...register('name')}
        />
        <input
          type="text"
          className="input"
          placeholder="Description"
          disabled={isSubmitting}
          required
          {...register('description')}
        />
      </FormModal>
    </Layout>
  );
}
