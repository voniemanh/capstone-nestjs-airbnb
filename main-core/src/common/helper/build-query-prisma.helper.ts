import { PagingDto } from '../dto/paging.dto';

export async function buildQueryPrisma({
  prismaModel,
  pagingQuery,
  filters = {},
  fieldOptions,
  baseWhere = {},
  include,
  select,
  orderBy,
}: {
  prismaModel: any;
  pagingQuery?: PagingDto;
  filters?: Record<string, any>;
  fieldOptions?: {
    string?: string[];
    number?: string[];
    boolean?: string[];
  };
  baseWhere?: Record<string, any>;
  include?: any;
  select?: any;
  orderBy?: any;
}) {
  const page = pagingQuery?.page ?? 1;
  const pageSize = pagingQuery?.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const where: Record<string, any> = {
    ...baseWhere,
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    if (fieldOptions?.string?.includes(key)) {
      if (typeof value === 'string') {
        where[key] = {
          contains: value,
        };
      }
      continue;
    }

    if (fieldOptions?.number?.includes(key)) {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        where[key] = num;
      }
      continue;
    }

    if (fieldOptions?.boolean?.includes(key)) {
      if (value === 'true' || value === true) where[key] = true;
      else if (value === 'false' || value === false) where[key] = false;
    }
  }

  const queryOptions: any = {
    where,
    skip,
    take: pageSize,
    orderBy,
  };

  if (select) queryOptions.select = select;
  else if (include) queryOptions.include = include;

  const [data, total] = await Promise.all([
    prismaModel.findMany(queryOptions),
    prismaModel.count({ where }),
  ]);

  return {
    data,
    page,
    pageSize,
    total,
  };
}
