import { ConceptReference } from "@/models/ConceptReference";

export class ConceptSummary {
  name = "";
  iri = "";
  scheme: ConceptReference = {} as ConceptReference;
  code = "";
  conceptType: any;
  isDescendentOf: ConceptReference[] = [];
  weighting = 0;
}
