import { PredicateObjectMap } from "./PredicateObjectMap";
import { ReferenceFormulationEnum } from "./ReferenceFormulationEnum";
import { SubjectMapTypeEnum } from "./SubjectMapTypeEnum";

export interface RMLMapping {
  id: number;
  name: string;

  source: string;
  referenceFormulation: ReferenceFormulationEnum;
  iterator: string;

  subjectMapType: SubjectMapTypeEnum;
  subjectMapValue: string;
  class: string;
  graph: string;

  objectMaps: PredicateObjectMap[];
}
