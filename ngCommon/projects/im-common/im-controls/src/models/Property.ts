import { Concept } from './../objectmodel/Concept';

export class Property {
  property: Concept;
  minCardinality: number;
  maxCardinality: number;
  valueType: Concept;
  level: number;
  owner: Concept;
}
