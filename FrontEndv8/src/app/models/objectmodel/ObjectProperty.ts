import { SubPropertyChain } from './SubPropertyChain';
import { PropertyAxiom } from './PropertyAxiom';
import { ClassAxiom } from './ClassAxiom';
import { Axiom } from './Axiom';
import { Concept } from './Concept';
export class ObjectProperty extends Concept {
  subObjectPropertyOf: Set<PropertyAxiom> ;
  inversePropertyOf: PropertyAxiom;
  objectPropertyRange: Set<ClassAxiom>;
  propertyDomain: Set<ClassAxiom>;
  subPropertyChain: Set<SubPropertyChain>;
  isFunctional: Axiom;
  isSymmetric: Axiom;
  isTransitive: Axiom;
  isReflexive: Axiom;
}
