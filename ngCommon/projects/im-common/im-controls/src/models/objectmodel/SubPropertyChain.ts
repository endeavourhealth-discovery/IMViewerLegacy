import { Axiom } from './Axiom';
import { ConceptReference } from './ConceptReference';
export class SubPropertyChain extends Axiom {
  property: Array<ConceptReference>;
}
