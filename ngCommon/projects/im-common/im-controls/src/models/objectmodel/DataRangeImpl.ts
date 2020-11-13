import { DataTypeRestriction } from './DataTypeRestriction';
import { ConceptReference } from './ConceptReference';
import { DataRange } from './DataRange';
export class DataRangeImpl implements DataRange {
  dataType: ConceptReference;
  dataTypeRestriction: DataTypeRestriction;
  oneOf: Set<ConceptReference>;
  exactValue: string;

  getExactValue(): string {
    throw new Error('Method not implemented.');
  }
  setExactValue(value: string): DataRange {
    throw new Error('Method not implemented.');
  }
  getOneOf(): Set<ConceptReference> {
    throw new Error('Method not implemented.');
  }
  setOneOf(oneOf: Set<ConceptReference>): DataRange {
    throw new Error('Method not implemented.');
  }
  addOneOf(value: string | ConceptReference): DataRange {
    throw new Error('Method not implemented.');
  }
  getDataType(): ConceptReference {
    throw new Error('Method not implemented.');
  }
  setDataType(dataType: string | ConceptReference): DataRange {
    throw new Error('Method not implemented.');
  }
}
