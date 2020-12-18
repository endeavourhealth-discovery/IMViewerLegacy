import {ConceptReference} from '../objectmodel/ConceptReference';

export class SearchRequest {
  terms: string;
  types: string[];
  includeLegacy: boolean = false;
  schemes: ConceptReference[];
  page: number = 1;
  size: number = 20;
}
