export class PagedResultSet<T> {
  pageSize = 15;
  page = 1;
  totalRecords: number;
  result: T[];
}
