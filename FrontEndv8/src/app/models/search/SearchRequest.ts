import { ConceptReference } from '../objectmodel/ConceptReference';
import { ConceptStatus } from '../objectmodel/ConceptStatus';
import { SortBy } from './SortBy';

export class SearchRequest {
  terms: string;
  types: string[];
  codeSchemes: ConceptReference[];
  sortBy: SortBy;
  statuses: ConceptStatus[];
  page: number = 1;
  size: number = 20;
  
}
