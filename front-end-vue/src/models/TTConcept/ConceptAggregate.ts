import { ConceptNode } from "./ConceptNode";
import { ConceptRole } from "./ConceptRole";

export class ConceptAggregate {
  concept: any;
  children: Array<ConceptNode>;
  parents: Array<ConceptNode>;
  graph: any;

  constructor(
    concept: any,
    children: Array<ConceptNode>,
    parents: Array<ConceptNode>,
    graph: any
  ) {
    this.concept = concept;
    this.children = children;
    this.parents = parents;
    this.graph = graph;
  }
}
