import { DataTypeDefinition } from './DataTypeDefinition';
import { Concept } from './Concept';
export class DataType extends Concept {
  dataTypeDefinition: Set<DataTypeDefinition>;
}
