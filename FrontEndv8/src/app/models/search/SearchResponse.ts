import { SearchRequest } from './SearchRequest';
import { SearchResponseConcept } from './SearchResponseConcept';

export class SearchResponse {
  pageStart: number;
  pageEnd: number;
  pageSize: number;
  totalSize: number;
  concepts: SearchResponseConcept[];
  request?: SearchRequest;
}
