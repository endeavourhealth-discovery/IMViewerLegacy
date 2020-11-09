export class Concept {
  dbid: number;
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: ConceptReference;
  status: ConceptStatus;
  version: number;
  isA: Set<Concept>;
  annotations: Set<Annotation>;
  isRef: boolean;
}

export class ConceptReference {
  dbid: number;
  iri: string;
  name: string;
}

export class ConceptStatus {
  _value: string;
  _name: string;
}

export class Annotation {
  property: ConceptReference;
  value: string;
}
