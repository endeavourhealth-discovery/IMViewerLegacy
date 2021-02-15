import { ConceptReference } from '../objectmodel/ConceptReference';
import { ConceptStatus } from '../objectmodel/ConceptStatus';
import { SortBy } from './SortBy';

export class SearchRequest {
  termFilter: string;
  statusFilter: ConceptStatus[];
  schemeFilter: ConceptReference[];
  descendentFilter: String[];
  markIfDescendentOf: string[];
  sortBy: SortBy;
  page: number = 1;
  size: number = 20;
}
