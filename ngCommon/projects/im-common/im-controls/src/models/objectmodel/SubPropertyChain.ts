import { ConceptReference } from './ConceptReference';
import { Axiom } from './Axiom';
export class SubPropertyChain extends Axiom{
  property: Set<ConceptReference>;
}
