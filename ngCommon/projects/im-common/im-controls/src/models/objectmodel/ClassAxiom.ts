import { IMAnnotated } from './IMAnnotated';
import { ClassExpression } from './ClassExpression';
import { Annotation } from './Annotation';
import { ConceptStatus } from './ConceptStatus';
import { IMEntity } from './IMEntity';
export class ClassAxiom extends ClassExpression implements IMAnnotated {
  status: ConceptStatus;
  version: number;
  annotationList: Set<Annotation>;

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
