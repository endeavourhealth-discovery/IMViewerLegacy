import { ConceptReference } from './ConceptReference';
class ConceptReferenceNode extends ConceptReference {
  parents: Set<ConceptReferenceNode>;
  children: Set<ConceptReferenceNode>;
  moduleId: string;
}
