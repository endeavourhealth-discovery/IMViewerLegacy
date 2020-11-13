import { PropertyAxiom } from './PropertyAxiom';
import { AnnotationPropertyRangeAxiom } from './AnnotationPropertyRangeAxiom';
import { Concept } from './Concept';
export class AnnotationProperty extends Concept {
  subAnnotationPropertyOf: Set<PropertyAxiom> ;
  propertyRange: Set<AnnotationPropertyRangeAxiom>;
}
