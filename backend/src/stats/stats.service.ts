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
    const numberOfCourses = await this.courseService.count();
    const numberOfContents = await this.contentService.count();
    const latestCourses = await this.courseService.findLatest(5);

    const result: StatsResponseDto = {
      numberOfCourses,
      numberOfContents,
      latestCourses,
    };

    if (includeUserCount) {
      result.numberOfUsers = await this.userService.count();
    }

    return result;
  }
}
