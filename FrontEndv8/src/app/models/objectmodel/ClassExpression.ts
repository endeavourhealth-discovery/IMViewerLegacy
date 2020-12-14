import { IMEntity } from './IMEntity';
import { ObjectPropertyValue } from './ObjectPropertyValue';
import { DataPropertyValue } from './DataPropertyValue';
import { ConceptReference } from './ConceptReference';
import { ConceptStatus } from './ConceptStatus';
import {Annotation} from './Annotation';
export class ClassExpression implements IMEntity {
  dbid: number;
  inferred: boolean;
  Class: ConceptReference;
  Intersection: Array<ClassExpression>;
  Union: Array<ClassExpression>;
  ComplementOf: ClassExpression;
  ObjectPropertyValue: ObjectPropertyValue;
  DataPropertyValue: DataPropertyValue;
  objectOneOf: Array<ConceptReference>;
  annotations: Set<Annotation>;
  module: ConceptReference;

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
