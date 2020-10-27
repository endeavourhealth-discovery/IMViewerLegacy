export class ConceptPropertyObject {
  dbid: number;
  concept: PropertyObjectConcept;
  group: number;
  property: PropertyObjectConcept;
  object: PropertyObjectConcept;
  minCardinality: number;
  maxCardinality: number;
  operator: string;
}

export class PropertyObjectConcept {
  dbid: number;
  namespace: Namespace;
  id: string;
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: number;
  status: ConceptStatus;
  weighting: number;
}

export class Namespace {
  dbid: number;
  iri: string;
  prefix: string;
}

export class ConceptStatus {
  dbid: number;
  name: string;
}
