import { IMEntity } from './IMEntity';
import { ObjectPropertyValue } from './ObjectPropertyValue';
import { DataPropertyValue } from './DataPropertyValue';
import { ConceptReference } from './ConceptReference';
import { ConceptStatus } from './ConceptStatus';
export class ClassExpression implements IMEntity {
  dbid: number;
  inferred: boolean;
  Concept: ConceptReference;
  intersection: Array<ClassExpression>;
  union: Array<ClassExpression>;
  complementOf: ClassExpression;
  objectPropertyValue: ObjectPropertyValue;
  dataPropertyValue: DataPropertyValue;
  objectOneOf: Array<ConceptReference>;

  getStatus(): ConceptStatus {
    throw new Error('Method not implemented.');
  }
  setStatus(status: ConceptStatus): IMEntity {
    throw new Error('Method not implemented.');
  }
  getVersion(): number {
    throw new Error('Method not implemented.');
  }
  setVersion(version: number): IMEntity {
    throw new Error('Method not implemented.');
  }
  setDbid(dbid: number): IMEntity {
    throw new Error('Method not implemented.');
  }
  getDbid(): number {
    throw new Error('Method not implemented.');
  }
}
