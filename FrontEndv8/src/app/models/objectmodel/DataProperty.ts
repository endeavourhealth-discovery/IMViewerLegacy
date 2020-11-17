import { Concept } from './Concept';
import { PropertyAxiom } from './PropertyAxiom';
import { DataPropertyRange } from './DataPropertyRange';
import { ClassAxiom } from './ClassAxiom';
import { Axiom } from './Axiom';
export class DataProperty extends Concept {
  subDataPropertyOf: Set<PropertyAxiom>;
  dataPropertyRange: Set<DataPropertyRange>;
  propertyDomain: Set<ClassAxiom>;
  isFunctional: Axiom;
}
