import { ConceptReference } from '@/models/ConceptReference';


export class ConceptSummary {
  name: string = "";
  iri: string = "";
  scheme: ConceptReference = {} as ConceptReference;
  code: string = "";
  conceptType: any;
  isDescendentOf: ConceptReference[] = [];
  weighting: number = 0;
}
