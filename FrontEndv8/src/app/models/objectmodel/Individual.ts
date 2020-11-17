import { Concept } from './Concept';
import { ConceptReference } from './ConceptReference';
import { ObjectPropertyValue } from './ObjectPropertyValue';
import { DataPropertyValue } from './DataPropertyValue';
export class Individual extends Concept {
  isType: ConceptReference;
  objectPropertyAssertion: Set<ObjectPropertyValue>;
  dataPropertyAssertion: Set<DataPropertyValue>;
}
