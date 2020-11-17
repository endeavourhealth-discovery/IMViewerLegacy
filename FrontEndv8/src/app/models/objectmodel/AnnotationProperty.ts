import { Concept } from './Concept';
import { PropertyAxiom } from './PropertyAxiom';
import { AnnotationPropertyRangeAxiom } from './AnnotationPropertyRangeAxiom';
export class AnnotationProperty extends Concept {
  subAnnotationPropertyOf: Set<PropertyAxiom>;
  propertyRange: Set<AnnotationPropertyRangeAxiom>;
}
