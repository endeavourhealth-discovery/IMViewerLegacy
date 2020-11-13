import { FacetRestriction } from './FacetRestriction';
import { ConceptReference } from './ConceptReference';
export class DataTypeRestriction {
  dataType: ConceptReference;
  facetRestriction: Set<FacetRestriction>;
}
