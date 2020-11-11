import { DataRangeAxiom } from './DataRangeAxiom';
import { PropertyAxiom } from './PropertyAxiom';
import { Concept } from './Concept';
import { ClassAxiom } from './ClassAxiom';
import { Axiom } from './Axiom';
export class DataProperty extends Concept {
  subDataPropertyOf: Set<PropertyAxiom>;
  dataPropertyRange: Set<DataRangeAxiom>;
  propertyDomain: Set<ClassAxiom>;
  isFunctional: Axiom;
}
