import {Concept} from './Concept';

export class Property {
  property: Concept;
  minCardinality: number;
  maxCardinality: number;
  valueType: Concept;
  propertyLevel: number;
  owner: Concept;
}
