import {ConceptReference} from '../objectmodel/ConceptReference';

export class SearchResponseConcept {
  name: string;
  iri: string;
  scheme: ConceptReference;
  code: string;
  types: ConceptReference[];
}
