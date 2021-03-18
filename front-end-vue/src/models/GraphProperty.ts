import { ConceptReference } from "./ConceptReference";

export interface GraphProperty extends ConceptReference {
  propertyNode: ConceptReference;
  inheritedFrom: ConceptReference;
  valueType: ConceptReference;
}
