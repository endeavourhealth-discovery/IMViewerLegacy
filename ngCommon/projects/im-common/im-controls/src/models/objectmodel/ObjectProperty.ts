import { Concept } from './Concept';
import { PropertyAxiom } from './PropertyAxiom';
import { ClassAxiom } from './ClassAxiom';
import { SubPropertyChain } from './SubPropertyChain';
import { Axiom } from './Axiom';
export class ObjectProperty extends Concept {
  subObjectPropertyOf: Set<PropertyAxiom>;
  inversePropertyOf: PropertyAxiom;
  objectPropertyRange: Set<ClassAxiom>;
  propertyDomain: Set<ClassAxiom>;
  subPropertyChain: Set<SubPropertyChain>;
  isFunctional: Axiom;
  isSymmetric: Axiom;
  isTransitive: Axiom;
  isReflexive: Axiom;
}
