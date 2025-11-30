import { PaginationQueryDto } from '../common/dto/pagination.dto';

export class UserQuery extends PaginationQueryDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}
