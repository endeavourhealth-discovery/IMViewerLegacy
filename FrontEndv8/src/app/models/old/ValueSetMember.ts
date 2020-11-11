import {SchemeCount} from './SchemeCount';

export class ValueSetMember {
  iri: string;
  code: string;
  name: string;
  operatorName: string;
  definition: any;
  counts: SchemeCount[];
}
