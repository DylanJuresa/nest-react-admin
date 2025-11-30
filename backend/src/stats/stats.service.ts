import { Injectable } from '@nestjs/common';

import { ContentService } from '../content/content.service';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { StatsResponseDto } from './stats.dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
  ) {}

  async getStats(includeUserCount: boolean = true): Promise<StatsResponseDto> {
    const [
      numberOfCourses,
      numberOfContents,
      latestCourses,
      numberOfUsers,
    ] = await Promise.all([
      this.courseService.count(),
      this.contentService.count(),
      this.courseService.findLatest(5),
      includeUserCount ? this.userService.count() : Promise.resolve(undefined),
    ]);

    return {
      numberOfCourses,
      numberOfContents,
      latestCourses,
      ...(numberOfUsers && { numberOfUsers }),
    };
  }
}
