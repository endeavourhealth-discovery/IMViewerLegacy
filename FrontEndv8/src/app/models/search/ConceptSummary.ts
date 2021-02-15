import {ConceptReference} from '../objectmodel/ConceptReference';
import {ConceptType} from '../objectmodel/ConceptType';

export class ConceptSummary {
  name: string;
  iri: string;
  scheme: ConceptReference;
  code: string;
  conceptType: ConceptType;
  isDescendentOf: ConceptReference[];
  weighting: number;
}
