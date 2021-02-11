import {ConceptReference} from '../objectmodel/ConceptReference';

export class ValueSetMembership {
  includedBy : ConceptReference;
  excludedBy : ConceptReference;
}
