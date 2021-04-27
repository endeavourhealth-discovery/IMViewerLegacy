import { ConceptReference } from "./ConceptReference";

export interface ConceptChild {
  hasChildren: boolean;
  iri: string;
  name: string;
  type: Array<ConceptReference>;
}
