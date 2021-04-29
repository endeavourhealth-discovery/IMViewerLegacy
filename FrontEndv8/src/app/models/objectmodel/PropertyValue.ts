import {ConceptReference} from './ConceptReference';
import {ClassExpression} from './ClassExpression';
import {QuantificationType} from './QuantificationType';

export class PropertyValue {
  property : ConceptReference;
  valueType : ConceptReference;
  inverseOf : ConceptReference;
  oneOf : string[];
  minInclusive : string;
  minExclusive : string;
  maxInclusive : string;
  maxExclusive : string;
  pattern : string;
  valueData: string;
  individual: string;
  expression: ClassExpression;
  group : number;

  min : number;
  max : number;
  quantification : QuantificationType;
}
