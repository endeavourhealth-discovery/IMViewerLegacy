import { Clazz } from './../objectmodel/Clazz';

export class Related {
  minCardinality: number;
  maxCardinality: number;
  relationship: Clazz;
  concept: Clazz;
}
