import { IMAnnotated } from './IMAnnotated';
import { Annotation } from './Annotation';
import { ConceptStatus } from './ConceptStatus';
import { ConceptReference } from './ConceptReference';
import { IMEntity } from './IMEntity';

export class Concept implements IMAnnotated {
  dbid: number;
  iri: string;
  name: string;
  description: string;
  code: string;
  scheme: ConceptReference;
  status: ConceptStatus;
  version: number;
  isA: Set<Concept>;
  annotations: Set<Annotation>;
  isRef: boolean;

  getAnnotations(): Set<Annotation> {
    throw new Error('Method not implemented.');
  }
  setAnnotations(annotationList: Set<Annotation>): IMAnnotated {
    throw new Error('Method not implemented.');
  }
  addAnnotation(annotation: Annotation): IMAnnotated {
    throw new Error('Method not implemented.');
  }
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
