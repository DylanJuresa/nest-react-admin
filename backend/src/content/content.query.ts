import { PaginationQueryDto } from '../common/dto/pagination.dto';

export class ContentQuery extends PaginationQueryDto {
  name?: string;
  description?: string;
}
