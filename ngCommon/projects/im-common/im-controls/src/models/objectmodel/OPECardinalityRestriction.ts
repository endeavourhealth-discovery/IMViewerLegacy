import { ClassExpression } from './ClassExpression';
import { ConceptReference } from './ConceptReference';
export class OPECardinalityRestriction extends ClassExpression {
  property: ConceptReference;
  inverseOf: ConceptReference;
  quantification: string;
  exact: number;
  min: number;
  max: number;
  individual: ConceptReference;
}
