import {ConceptReference} from './ConceptReference';

export class PropertyConstraint {
  Property : ConceptReference;
  min : number;
  max : number;
  ValueClass : ConceptReference
  DataType : ConceptReference;
  oneOf : string[];
  minInclusive : string;
  minExclusive : string;
  maxInclusive : string;
  maxExclusive : string;
  pattern : string;
}
