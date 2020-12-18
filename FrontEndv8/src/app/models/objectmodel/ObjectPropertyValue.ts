import { QuantificationImpl } from './QuantificationImpl';
import { ConceptReference } from './ConceptReference';
import { ClassExpression } from './ClassExpression';
export class ObjectPropertyValue extends QuantificationImpl {
  Property: ConceptReference;
  InverseOf: ConceptReference;
  ValueType: ConceptReference;
  ValueData: string;
  Individual: string;
  Expression: ClassExpression;
}
