import { ConceptReference } from './ConceptReference';
import { ClassExpression } from './ClassExpression';
import { Concept } from './Concept';
import { ClassAxiom } from './ClassAxiom';
export class Clazz extends Concept {
  subClassOf: Set<ClassAxiom>;
  equivalentTo: Set<ClassAxiom>;
  expression: ClassExpression;
  disjointWithClass: Set<ConceptReference>;
}
