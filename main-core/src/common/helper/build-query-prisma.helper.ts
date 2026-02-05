import { filter } from 'rxjs';
import { PagingDto } from '../dto/paging.dto';
import { buildPaging } from './build-paging.helper';
import { buildWhere } from './build-where.helper';

export async function buildQueryPrisma({
  prismaModel,
  query,
  filters = {},
  where = {},
  filterOptions,
  include,
  select,
  orderBy,
}: {
  prismaModel: any;
  query?: PagingDto;
  filters?: Record<string, any>;
  where?: any;
  filterOptions?: {
    stringFields?: string[];
    exactFields?: string[];
    baseWhere?: Record<string, any>;
  };
  include?: any;
  select?: any;
  orderBy?: any;
}) {
  console.log('RAW QUERY:', query);
  console.log('RAW FILTERS:', filters);

  const { page, pageSize, index } = buildPaging(query);
  const filteredWhere = buildWhere(filters, {
    ...filterOptions,
    baseWhere: where,
  });

  console.log('FINAL WHERE:', JSON.stringify(filteredWhere, null, 2));

  const [data, total] = await Promise.all([
    prismaModel.findMany({
      where: filteredWhere,
      skip: index,
      take: pageSize,
      include,
      select,
      orderBy,
    }),
    prismaModel.count({ where: filteredWhere }),
  ]);
  console.log('FINAL WHERE:', filteredWhere);

  return { data, page, pageSize, total };
}
