import { ConceptType } from "./ConceptType";
import { ConceptReference } from "@/models/ConceptReference";
import { ConceptStatus } from "./../ConceptStatus";
import { SortBy } from "./SortBy";

export class SearchRequest {
  termFilter!: string;
  statusFilter!: ConceptStatus[];
  typeFilter!: ConceptType[];
  schemeFilter!: ConceptReference[];
  descendentFilter!: string[];
  markIfDescendentOf!: string[];
  sortBy!: SortBy;
  page!: number;
  size!: number;
}