import { ConceptReference } from './ConceptReference';
import { Axiom } from './Axiom';
export class DataPropertyAssertionAxiom extends Axiom {
  property: ConceptReference;
  dataType: ConceptReference;
  value: string;
}
