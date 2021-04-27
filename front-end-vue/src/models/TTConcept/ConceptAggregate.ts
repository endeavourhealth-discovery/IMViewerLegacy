import { ConceptNode } from "./ConceptNode";
import { Concept } from "./Concept";

export class ConceptAggregate {
  concept: Concept;
  children: Array<ConceptNode>;
  parents: Array<ConceptNode>;
  properties: [];
  roles: [];

  constructor(
    concept: Concept,
    children: Array<ConceptNode>,
    parents: Array<ConceptNode>,
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
