import { TTIriRef } from "../TripleTree";
import { ConceptSummary } from "@/models/search/ConceptSummary";

export interface PartialBundle {
  entity: any;
  predicates: TTIriRef[];
}

export interface SearchResponse {
  entities: ConceptSummary[];
  page: number;
  count: number;
}
