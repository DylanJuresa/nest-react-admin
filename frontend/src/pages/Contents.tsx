import { useState } from 'react';
import { Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import FormModal from '../components/shared/FormModal';
import Pagination from '../components/shared/Pagination';
import RefreshButton from '../components/shared/RefreshButton';
import useAuth from '../hooks/useAuth';
import useFilteredQuery from '../hooks/useFilteredQuery';
import { PaginatedResponse } from '../models/common/Pagination';
import Content from '../models/content/Content';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();

  const [addContentShow, setAddContentShow] = useState(false);

  const courseQuery = useQuery('course', async () => courseService.findOne(id));

  const {
    data,
    isLoading,
    isFetching,
    refetch,
    filters,
    updateFilter,
  } = useFilteredQuery<
    PaginatedResponse<Content>,
    { name: string; description: string; page: number; limit: number }
  >({
    queryKey: `contents-${id}`,
    queryFn: (filters) => contentService.findAll(id, filters),
    initialFilters: { name: '', description: '', page: 1, limit: 10 },
  });

  const contents = data?.results ?? [];
  const meta = data?.meta;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const saveContent = async (createContentRequest: CreateContentRequest) => {
    await contentService.save(id, createContentRequest);
    setAddContentShow(false);
    reset();
    refetch();
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">
        {!courseQuery.isLoading ? `${courseQuery.data.name} Contents` : ''}
      </h1>
      <hr />
      <div className="flex flex-col sm:flex-row gap-3 my-5">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddContentShow(true)}
          >
            <Plus /> Add Content
          </button>
        ) : null}
        <RefreshButton isLoading={isFetching} onRefresh={refetch} />
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

      <ContentsTable
        data={contents}
        isLoading={isLoading}
        courseId={id}
        refetch={refetch}
      />

      {meta && (
        <Pagination
          meta={meta}
          onPageChange={(page) => updateFilter('page', page)}
        />
      )}

      <FormModal
        show={addContentShow}
        title="Add Content"
        onClose={() => {
          reset();
          setAddContentShow(false);
        }}
        onSubmit={handleSubmit(saveContent)}
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
