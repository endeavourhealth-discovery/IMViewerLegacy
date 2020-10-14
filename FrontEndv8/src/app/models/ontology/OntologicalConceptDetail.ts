import { Axiom } from './Axiom';
export class OntologicalConceptDetail {
  iri: string;
  name: string;
  description: string;
  axioms: Array<Axiom>;
}
