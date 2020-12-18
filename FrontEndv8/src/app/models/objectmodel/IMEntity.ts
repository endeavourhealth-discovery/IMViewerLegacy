import { ConceptStatus } from './ConceptStatus';
export interface IMEntity {
  getStatus(): ConceptStatus;
  setStatus(status: ConceptStatus): IMEntity;
  getVersion(): number;
  setVersion(version: number): IMEntity;
  setDbid(dbid: number): IMEntity;
  getDbid(): number;
}
