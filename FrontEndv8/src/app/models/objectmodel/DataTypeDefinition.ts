import { Axiom } from './Axiom';
import { ConceptReference } from './ConceptReference';
export class DataTypeDefinition extends Axiom {
  dataType: ConceptReference;
  oneOf: Set<string>;
  minOperator: string;
  minValue: string;
  maxOperator: string;
  maxValue: string;
  pattern: string;
}
