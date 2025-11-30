import { PaginationQueryDto } from '../common/dto/pagination.dto';

export class CourseQuery extends PaginationQueryDto {
  name?: string;
  description?: string;
}
