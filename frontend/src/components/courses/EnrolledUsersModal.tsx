import { useState } from 'react';
import { Loader, Users, X } from 'react-feather';
import toast from 'react-hot-toast';

import User from '../../models/user/User';
import courseService from '../../services/CourseService';
import Modal from '../shared/Modal';

interface EnrolledUsersModalProps {
  courseId: string;
  enrolledCount: number;
}

export default function EnrolledUsersModal({
  courseId,
  enrolledCount,
}: EnrolledUsersModalProps) {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    try {
      setIsLoading(true);
      setShow(true);
      const enrolledUsers = await courseService.getEnrolledUsers(courseId);
      setUsers(enrolledUsers);
    } catch (error) {
      toast.error('Error al cargar inscripciones');
      setShow(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setUsers([]);
  };

  return (
    <>
      <button
        className="text-blue-600 hover:text-blue-900 focus:outline-none mr-3"
        onClick={handleOpen}
        title={`${enrolledCount} inscriptos`}
      >
        <Users size={16} className="inline" /> {enrolledCount}
      </button>

      <Modal show={show}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Usuarios Inscriptos</h1>
          <button className="ml-auto focus:outline-none" onClick={handleClose}>
            <X size={30} />
          </button>
        </div>
        <hr />
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-4">
              <Loader className="animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay usuarios inscriptos en este curso
            </p>
          ) : (
            <ul className="divide-y">
              {users.map((user) => (
                <li key={user.id} className="py-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}
