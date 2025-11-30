import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import User from '../models/user/User';
import apiService from './ApiService';

class CourseService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/api/courses', createCourseRequest);
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    return (
      await apiService.get<Course[]>('/api/courses', { params: courseQuery })
    ).data;
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/api/courses/${id}`)).data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest,
  ): Promise<void> {
    await apiService.put(`/api/courses/${id}`, updateCourseRequest);
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/courses/${id}`);
  }

  async enroll(courseId: string): Promise<void> {
    await apiService.post(`/api/courses/${courseId}/enroll`);
  }

  async unenroll(courseId: string): Promise<void> {
    await apiService.delete(`/api/courses/${courseId}/enroll`);
  }

  async getEnrolledUsers(courseId: string): Promise<User[]> {
    return (
      await apiService.get<User[]>(`/api/courses/${courseId}/enrollments`)
    ).data;
  }
}

export default new CourseService();
