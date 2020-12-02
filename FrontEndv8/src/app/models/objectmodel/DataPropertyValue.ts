import { QuantificationImpl } from './QuantificationImpl';
import { ConceptReference } from './ConceptReference';
export class DataPropertyValue extends QuantificationImpl {
  Property: ConceptReference;
  dataType: ConceptReference;
  valueData: string;
}
