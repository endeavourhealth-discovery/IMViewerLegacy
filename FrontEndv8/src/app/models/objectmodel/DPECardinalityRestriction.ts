import { IMEntity } from './IMEntity';
import { ConceptReference } from './ConceptReference';
import { DataRangeImpl } from './DataRangeImpl';
import { ConceptStatus } from './ConceptStatus';
export class DPECardinalityRestriction extends DataRangeImpl implements IMEntity {
  dbid: number;
  property: ConceptReference;
  quantification: string;
  exact: number;
  min: number;
  max: number;

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
