import { ConceptNode } from "./ConceptNode";
import { Concept } from "./Concept";
import { ConceptRole } from "./ConceptRole";

export class ConceptAggregate {
  concept: Concept;
  children: Array<ConceptNode>;
  parents: Array<ConceptNode>;
  properties: [];
  roles: Array<ConceptRole>;

  constructor(
    concept: Concept,
    children: Array<ConceptNode>,
    parents: Array<ConceptNode>,
    properties: [],
    roles: Array<ConceptRole>
  ) {
    this.concept = concept;
    this.children = children;
    this.parents = parents;
    this.properties = properties;
    this.roles = roles;
  }
}
