import {SearchResponseConcept} from './SearchResponseConcept';

export class SearchResponse {
  page: number;
  count: number;
  concepts: SearchResponseConcept[];
}
