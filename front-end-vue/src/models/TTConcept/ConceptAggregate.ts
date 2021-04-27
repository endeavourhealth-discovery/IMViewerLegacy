import { ConceptChild} from "./ConceptChild";
import { Concept } from "./Concept";

export class ConceptAggregate {
  concept: Concept;
  children: Array<ConceptChild>;
  parents: [];
  properties: [];
  roles: [];

  constructor(
    concept: Concept,
    children: Array<ConceptChild>,
    parents: [],
    properties: [],
    roles: []
  ) {
    this.concept = concept;
    this.children = children;
    this.parents = parents;
    this.properties = properties;
    this.roles = roles;
  }
}
