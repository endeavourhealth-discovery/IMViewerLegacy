import { Clazz } from './../objectmodel/Clazz';

export class Property {
  property: Clazz;
  minCardinality: number;
  maxCardinality: number;
  valueType: Clazz;
  level: number;
  owner: Clazz;
}
