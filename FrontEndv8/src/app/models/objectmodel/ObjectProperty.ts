import { Concept } from './Concept';
import { PropertyAxiom } from './PropertyAxiom';
import { SubPropertyChain } from './SubPropertyChain';
import { Axiom } from './Axiom';
import {ClassExpression} from './ClassExpression';
export class ObjectProperty extends Concept {
  subObjectPropertyOf: Set<PropertyAxiom>;
  inversePropertyOf: PropertyAxiom;
  objectPropertyRange: Set<ClassExpression>;
  propertyDomain: Set<ClassExpression>;
  subPropertyChain: Set<SubPropertyChain>;
  isFunctional: Axiom;
  isSymmetric: Axiom;
  isTransitive: Axiom;
  isReflexive: Axiom;
}
