import { Property } from './Property';
export class DataModelDetail {
  iri: string;
  name: string;
  description: string;
  properties: Array<Property>;
  parents: Array<object>;
  children: Array<object>;
}
