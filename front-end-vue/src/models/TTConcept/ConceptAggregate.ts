import { ConceptNode } from "./ConceptNode";
import { ConceptRole } from "./ConceptRole";

export class ConceptAggregate {
  concept: any;
  children: Array<ConceptNode>;
  parents: Array<ConceptNode>;
  properties: [];
  roles: Array<ConceptRole>;

  constructor(
    concept: any,
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
