import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import Content from '../../models/content/Content';
import UpdateContentRequest from '../../models/content/UpdateContentRequest';
import contentService from '../../services/ContentService';
import DeleteModal from '../shared/DeleteModal';
import FormModal from '../shared/FormModal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface ContentsTableProps {
  data: Content[];
  courseId: string;
  isLoading: boolean;
  refetch: () => void;
}

export default function ContentsTable({
  data,
  isLoading,
  courseId,
  refetch,
}: ContentsTableProps) {
  const { authenticatedUser } = useAuth();
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string>();
  const [updateShow, setUpdateShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateContentRequest>();

  const handleDelete = async () => {
    await contentService.delete(courseId, selectedContentId);
    refetch();
  };

  const handleUpdate = async (updateContentRequest: UpdateContentRequest) => {
    await contentService.update(
      courseId,
      selectedContentId,
      updateContentRequest,
    );
    setUpdateShow(false);
    reset();
    refetch();
  };

  return (
    <>
      <div className="table-container">
        <Table columns={['Name', 'Description', 'Created']}>
          {isLoading
            ? null
            : data.map(({ id, name, description, dateCreated }) => (
                <tr key={id}>
                  <TableItem>{name}</TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>
                    {new Date(dateCreated).toLocaleDateString()}
                  </TableItem>
                  <TableItem className="text-right">
                    {['admin', 'editor'].includes(authenticatedUser.role) ? (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                        onClick={() => {
                          setSelectedContentId(id);

                          setValue('name', name);
                          setValue('description', description);

                          setUpdateShow(true);
                        }}
                      >
                        Edit
                      </button>
                    ) : null}
                    {authenticatedUser.role === 'admin' ? (
                      <button
                        className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                        onClick={() => {
                          setSelectedContentId(id);
                          setDeleteShow(true);
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </TableItem>
                </tr>
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
        title="Delete Content"
        message="Are you sure you want to delete the content? All of content's data will be permanently removed. This action cannot be undone."
        onClose={() => setDeleteShow(false)}
        onConfirm={handleDelete}
      />

      <FormModal
        show={updateShow}
        title="Update Content"
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
