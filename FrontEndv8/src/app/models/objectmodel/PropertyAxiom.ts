import { Axiom } from './Axiom';
import { ConceptReference } from './ConceptReference';
export class PropertyAxiom extends Axiom {
  property: ConceptReference;
}
