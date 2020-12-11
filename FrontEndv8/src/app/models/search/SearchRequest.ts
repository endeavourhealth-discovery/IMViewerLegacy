export class SearchRequest {
  terms: string;
  types: string[];
  includeLegacy: boolean = false;
  page: number = 1;
  size: number = 20;
}
