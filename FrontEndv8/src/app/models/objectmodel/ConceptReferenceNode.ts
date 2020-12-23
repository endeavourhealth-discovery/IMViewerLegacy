import { ConceptReference } from './ConceptReference';
export class ConceptReferenceNode extends ConceptReference {
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  moduleId: string;
  hasChildren: boolean;
}
