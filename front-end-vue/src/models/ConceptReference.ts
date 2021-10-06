export interface ConceptReference {
  iri: string;
  name: string;
  iriType?: ConceptReference;
}
