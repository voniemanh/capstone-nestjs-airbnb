import { PagingDto } from '../dto/paging.dto';
export function buildPaging(query?: PagingDto) {
  const page = query?.page ?? 1;
  const pageSize = query?.pageSize ?? 10;

  const index = (page - 1) * pageSize;

  return { page, pageSize, index };
}
