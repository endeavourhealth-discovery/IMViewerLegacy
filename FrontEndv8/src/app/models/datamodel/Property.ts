import { Value } from './Value';

export class Property {
  iri: string;
  name: string;
  description: string;
  minCardinality: number;
  maxCardinality: number;
  value: Value;
}
