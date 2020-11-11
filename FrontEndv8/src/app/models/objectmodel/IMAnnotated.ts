import { IMEntity } from './IMEntity';
import { Annotation } from './Annotation';
export interface IMAnnotated extends IMEntity{
  getAnnotations(): Set<Annotation>;
  setAnnotations(annotationList: Set<Annotation> ): IMAnnotated;
  addAnnotation(annotation: Annotation): IMAnnotated;
}
