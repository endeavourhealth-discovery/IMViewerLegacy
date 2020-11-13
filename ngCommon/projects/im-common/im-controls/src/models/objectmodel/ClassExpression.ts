import { IMEntity } from './IMEntity';
import { DPECardinalityRestriction } from './DPECardinalityRestriction';
import { OPECardinalityRestriction } from './OPECardinalityRestriction';
import { ConceptReference } from './ConceptReference';
import { ConceptStatus } from './ConceptStatus';
export class ClassExpression implements IMEntity {
  inferred: boolean;
  clazz: ConceptReference;
  intersection: Set<ClassExpression>;
  union: Set<ClassExpression>;
  complementOf: ClassExpression;
  propertyObject: OPECardinalityRestriction;
  propertyData: DPECardinalityRestriction;
  objectOneOf: Set<ConceptReference>;

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
}
