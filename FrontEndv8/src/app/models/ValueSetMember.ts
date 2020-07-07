import {SchemeCount} from './SchemeCount';

export class ValueSetMember {
  iri: string;
  code: string;
  name: string;
  definition: any;
  counts: SchemeCount[];
}
