import { Code } from './Code';
export class ValueSetDetail {
  iri: string;
  name: string;
  description: string;
  members: Array<Code>;
}
