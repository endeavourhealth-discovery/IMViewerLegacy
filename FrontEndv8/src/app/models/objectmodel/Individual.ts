import { DataPropertyAssertionAxiom } from './DataPropertyAssertionAxiom';
import { ConceptReference } from './ConceptReference';
import { Concept } from './Concept';
export class Individual extends Concept{
  isType: ConceptReference;
  propertyDataValue: Set<DataPropertyAssertionAxiom>;
}
