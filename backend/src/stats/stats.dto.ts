import { Course } from '../course/course.entity';

export interface StatsResponseDto {
  numberOfUsers?: number;
  numberOfCourses: number;
  numberOfContents: number;
  latestCourses: Course[];
}
