import { Concept } from './Concept';
export class ConceptNode extends Concept {
  parents: Set<ConceptNode>;
  children: Set<ConceptNode>;
  moduleId: string;
}
