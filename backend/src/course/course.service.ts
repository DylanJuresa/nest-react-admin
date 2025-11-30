import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, ILike } from 'typeorm';

import { User } from '../user/user.entity';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery, userId?: string): Promise<any[]> {
    Object.keys(courseQuery).forEach((key) => {
      courseQuery[key] = ILike(`%${courseQuery[key]}%`);
    });

    const courses = await Course.find({
      where: courseQuery,
      order: {
        name: 'ASC',
        description: 'ASC',
      },
      relations: ['enrolledUsers'],
    });

    let enrolledCourseIds: Set<string> = new Set();
    if (userId) {
      const user = await User.findOne(userId, {
        relations: ['enrolledCourses'],
        select: ['id'],
      });
      enrolledCourseIds = new Set(
        user?.enrolledCourses?.map((c) => c.id) || [],
      );
    }

    return courses.map((course) => {
      const { enrolledUsers, ...courseData } = course;
      return {
        ...courseData,
        isEnrolled: enrolledCourseIds.has(course.id),
        enrolledCount: enrolledUsers?.length || 0,
      };
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async findByIdWithEnrollments(id: string): Promise<Course> {
    const course = await Course.findOne(id, { relations: ['enrolledUsers'] });
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }

  async findLatest(limit: number = 5): Promise<Course[]> {
    return await Course.find({
      order: {
        dateCreated: 'DESC',
      },
      take: limit,
    });
  }

  async enroll(courseId: string, userId: string): Promise<void> {
    await this.findById(courseId);

    const user = await User.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isEnrolled = await this.isUserEnrolled(courseId, userId);
    if (isEnrolled) {
      throw new HttpException(
        'User is already enrolled in this course',
        HttpStatus.BAD_REQUEST,
      );
    }

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into('course_enrollments')
      .values({ courseId, userId })
      .execute();
  }

  async unenroll(courseId: string, userId: string): Promise<void> {
    const isEnrolled = await this.isUserEnrolled(courseId, userId);
    if (!isEnrolled) {
      throw new HttpException(
        'User is not enrolled in this course',
        HttpStatus.BAD_REQUEST,
      );
    }

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from('course_enrollments')
      .where('"courseId" = :courseId AND "userId" = :userId', {
        courseId,
        userId,
      })
      .execute();
  }

  async isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    const result = await getConnection()
      .createQueryBuilder()
      .select('1')
      .from('course_enrollments', 'ce')
      .where('ce."courseId" = :courseId AND ce."userId" = :userId', {
        courseId,
        userId,
      })
      .getRawOne();
    return !!result;
  }

  async getEnrolledUsers(courseId: string): Promise<Partial<User>[]> {
    const course = await this.findByIdWithEnrollments(courseId);
    return (course.enrolledUsers || []).map(
      ({ id, firstName, lastName, username }) => ({
        id,
        firstName,
        lastName,
        username,
      }),
    );
  }
}
