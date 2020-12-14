import { Concept } from './Concept';
import { PropertyAxiom } from './PropertyAxiom';
import { DataPropertyRange } from './DataPropertyRange';
import { Axiom } from './Axiom';
import {ClassExpression} from './ClassExpression';
export class DataProperty extends Concept {
  subDataPropertyOf: Set<PropertyAxiom>;
  dataPropertyRange: Set<DataPropertyRange>;
  propertyDomain: Set<ClassExpression>;
  isFunctional: Axiom;
}
