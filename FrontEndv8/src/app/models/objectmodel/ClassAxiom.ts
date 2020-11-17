import { ClassExpression } from './ClassExpression';
import { IMAnnotated } from './IMAnnotated';
import { ConceptStatus } from './ConceptStatus';
import { Annotation } from './Annotation';
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
}
