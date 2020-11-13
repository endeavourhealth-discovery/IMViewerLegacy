import { Namespace } from './Namespace';
import { DocumentInfo } from './DocumentInfo';
import { Clazz } from './Clazz';
import { ObjectProperty } from './ObjectProperty';
import { DataProperty } from './DataProperty';
import { DataType } from './DataType';
import { AnnotationProperty } from './AnnotationProperty';
import { Individual } from './Individual';
export class Ontology {
  iri: string;
  module: string;
  imports: Set<string>;
  namespace: Set<Namespace>;
  documentInfo: DocumentInfo;
  clazz: Set<Clazz>;
  objectProperty: Set<ObjectProperty>;
  dataProperty: Set<DataProperty>;
  dataType: Set<DataType>;
  annotationProperty: Set<AnnotationProperty>;
  individual: Set<Individual>;
}
