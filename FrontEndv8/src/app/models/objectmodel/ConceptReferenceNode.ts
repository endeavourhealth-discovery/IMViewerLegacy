import { ConceptReference } from './ConceptReference';
export class ConceptReferenceNode extends ConceptReference {
  parents: Set<ConceptReferenceNode>;
  children: Set<ConceptReferenceNode>;
  moduleId: string;
}
