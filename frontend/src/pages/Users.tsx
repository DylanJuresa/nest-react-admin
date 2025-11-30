import { useState } from 'react';
import { Plus } from 'react-feather';
import { useForm } from 'react-hook-form';

import Layout from '../components/layout';
import FormModal from '../components/shared/FormModal';
import Pagination from '../components/shared/Pagination';
import RefreshButton from '../components/shared/RefreshButton';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import useFilteredQuery from '../hooks/useFilteredQuery';
import { PaginatedResponse } from '../models/common/Pagination';
import CreateUserRequest from '../models/user/CreateUserRequest';
import User from '../models/user/User';
import userService from '../services/UserService';

export default function Users() {
  const { authenticatedUser } = useAuth();

  const [addUserShow, setAddUserShow] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
    filters,
    updateFilter,
  } = useFilteredQuery<
    PaginatedResponse<User>,
    {
      firstName: string;
      lastName: string;
      username: string;
      role: string;
      page: number;
      limit: number;
    }
  >({
    queryKey: 'users',
    queryFn: (filters) => userService.findAll(filters),
    initialFilters: {
      firstName: '',
      lastName: '',
      username: '',
      role: '',
      page: 1,
      limit: 2,
    },
  });

  const users = (data?.results ?? []).filter(
    (user) => user.id !== authenticatedUser.id,
  );
  const meta = data?.meta;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    await userService.save(createUserRequest);
    setAddUserShow(false);
    reset();
    refetch();
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Users</h1>
      <hr />
      <div className="flex flex-col sm:flex-row gap-3 my-5">
        <button
          className="btn flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddUserShow(true)}
        >
          <Plus /> Add User
        </button>
        <RefreshButton onRefresh={() => refetch()} isLoading={isFetching} />
      </div>

      <div className="table-filter mt-2">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="First Name"
            value={filters.firstName}
            onChange={(e) => updateFilter('firstName', e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Last Name"
            value={filters.lastName}
            onChange={(e) => updateFilter('lastName', e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Username"
            value={filters.username}
            onChange={(e) => updateFilter('username', e.target.value)}
          />
          <select
            name=""
            id=""
            className="input w-1/2"
            value={filters.role}
            onChange={(e) => updateFilter('role', e.target.value)}
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <UsersTable data={users} isLoading={isLoading} refetch={refetch} />

      {meta && (
        <Pagination
          meta={meta}
          onPageChange={(page) => updateFilter('page', page)}
        />
      )}

      <FormModal
        show={addUserShow}
        title="Add User"
        onClose={() => {
          reset();
          setAddUserShow(false);
        }}
        onSubmit={handleSubmit(saveUser)}
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-5 sm:flex-row">
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="First Name"
            required
            disabled={isSubmitting}
            {...register('firstName')}
          />
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="Last Name"
            required
            disabled={isSubmitting}
            {...register('lastName')}
          />
        </div>
        <input
          type="text"
          className="input"
          required
          placeholder="Username"
          disabled={isSubmitting}
          {...register('username')}
        />
        <input
          type="password"
          className="input"
          required
          placeholder="Password (min 6 characters)"
          disabled={isSubmitting}
          {...register('password')}
        />
        <select
          className="input"
          required
          {...register('role')}
          disabled={isSubmitting}
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </FormModal>
    </Layout>
  );
}
