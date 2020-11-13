import { ConceptReference } from './ConceptReference';
export interface DataRange {
  getExactValue(): string;
  setExactValue(value: string): DataRange;
  getOneOf(): Set<ConceptReference>;
  setOneOf(oneOf: Set<ConceptReference>): DataRange;
  addOneOf(value: ConceptReference | string): DataRange;
  getDataType(): ConceptReference;
  setDataType(dataType: ConceptReference | string): DataRange;
}
