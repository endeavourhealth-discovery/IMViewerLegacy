import { QuantificationImpl } from './QuantificationImpl';
import { ConceptReference } from './ConceptReference';
export class DataPropertyValue extends QuantificationImpl {
  Property: ConceptReference;
  DataType: ConceptReference;
  valueData: string;
}
