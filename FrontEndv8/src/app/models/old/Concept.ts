import { Namespace, ConceptStatus } from './ConceptPropertyObject';
export class Concept {
  iri: string;
  name: string;
  description: string;
  namespace: Namespace;
  id: string;
  code: string;
  scheme: number;
  status: ConceptStatus;
  weighting: number;
}
