import { useState } from 'react';
import { useForm } from 'react-hook-form';

import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import userService from '../../services/UserService';
import DeleteModal from '../shared/DeleteModal';
import FormModal from '../shared/FormModal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
  refetch: () => void;
}

export default function UsersTable({
  data,
  isLoading,
  refetch,
}: UsersTableProps) {
  const [deleteShow, setDeleteShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleDelete = async () => {
    await userService.delete(selectedUserId);
    refetch();
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    await userService.update(selectedUserId, updateUserRequest);
    setUpdateShow(false);
    reset();
    refetch();
  };

  return (
    <>
      <div className="table-container">
        <Table columns={['Name', 'Username', 'Status', 'Role', 'Created']}>
          {isLoading
            ? null
            : data.map(
                ({ id, firstName, lastName, role, isActive, username }) => (
                  <tr key={id}>
                    <TableItem>{`${firstName} ${lastName}`}</TableItem>
                    <TableItem>{username}</TableItem>
                    <TableItem>
                      {isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </TableItem>
                    <TableItem>{role}</TableItem>
                    <TableItem className="text-right">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);

                          setValue('firstName', firstName);
                          setValue('lastName', lastName);
                          setValue('username', username);
                          setValue('role', role);
                          setValue('isActive', isActive);

                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedUserId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    </TableItem>
                  </tr>
                ),
              )}
        </Table>

        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>Empty</h1>
          </div>
        ) : null}
      </div>
      {/* Delete User Modal */}
      <DeleteModal
        show={deleteShow}
        title="Delete User"
        message="Are you sure you want to delete the user? All of user's data will be permanently removed. This action cannot be undone."
        onClose={() => setDeleteShow(false)}
        onConfirm={handleDelete}
      />
      {/* Update User Modal */}
      <FormModal
        show={updateShow}
        title="Update User"
        onClose={() => {
          setUpdateShow(false);
          reset();
        }}
        onSubmit={handleSubmit(handleUpdate)}
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-5 sm:flex-row">
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="First Name"
            disabled={isSubmitting}
            {...register('firstName')}
          />
          <input
            type="text"
            className="input sm:w-1/2"
            placeholder="Last Name"
            disabled={isSubmitting}
            {...register('lastName')}
          />
        </div>
        <input
          type="text"
          className="input"
          placeholder="Username"
          disabled={isSubmitting}
          {...register('username')}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          disabled={isSubmitting}
          {...register('password')}
        />
        <select className="input" {...register('role')} disabled={isSubmitting}>
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <div>
          <label className="font-semibold mr-3">Active</label>
          <input
            type="checkbox"
            className="input w-5 h-5"
            {...register('isActive')}
          />
        </div>
      </FormModal>
    </>
  );
}
