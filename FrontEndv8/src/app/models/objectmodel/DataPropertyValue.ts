import { QuantificationImpl } from './QuantificationImpl';
import { ConceptReference } from './ConceptReference';
export class DataPropertyValue extends QuantificationImpl {
  property: ConceptReference;
  dataType: ConceptReference;
  valueData: string;
}
