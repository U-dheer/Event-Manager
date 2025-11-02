import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: number;
}

export interface PaginatedResult<T> {
  first: number;
  last: number;
  limit: number;
  total?: number;
  data: T[];
}

export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = { limit: 10, currentPage: 1 },
): Promise<PaginatedResult<T>> {
  const offset = (options.currentPage - 1) * options.limit; //number of items we want per page
  const data = await qb.limit(options.limit).offset(offset).getMany();

  return {
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : undefined,
    data,
  };
}
