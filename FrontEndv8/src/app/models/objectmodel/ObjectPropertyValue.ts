import { QuantificationImpl } from './QuantificationImpl';
import { ConceptReference } from './ConceptReference';
import { ClassExpression } from './ClassExpression';
export class ObjectPropertyValue extends QuantificationImpl {
  property: ConceptReference;
  inverseOf: ConceptReference;
  valueType: ConceptReference;
  valueData: string;
  individual: string;
  expression: ClassExpression;
}
