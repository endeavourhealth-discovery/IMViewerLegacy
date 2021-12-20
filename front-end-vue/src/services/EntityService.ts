import { SearchRequest } from "@/models/search/SearchRequest";
import axios, { CancelToken } from "axios";
import GraphData from "@/models/GraphData";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import { PartialBundle, SearchResponse } from "@/models/entityServiceTypes/EntityServiceTypes";
import { EntityDefinitionDto } from "@/models/EntityDefinitionDto";
import { TTBundle, TTIriRef } from "@/models/TripleTree";
import { ExportValueSet } from "@/models/members/ExportValueSet";
import { TermCode } from "@/models/terms/TermCode";
import { DataModelProperty } from "@/models/properties/DataModelProperty";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { Namespace } from "@/models/Namespace";
import { FiltersAsIris } from "@/models/FiltersAsIris";

export default class EntityService {
  static api = process.env.VUE_APP_API;

  public static async getSimpleMaps(iri: string): Promise<any[]> {
    try {
      return await axios.get(this.api + "api/entity/simpleMaps", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getPartialEntity(iri: string, predicates: string[]): Promise<any> {
    try {
      return await axios.get(this.api + "api/entity/partial", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      });
    } catch (error) {
      return {} as any;
    }
  }

  public static async getPartialEntityBundle(iri: string, predicates: string[]): Promise<PartialBundle> {
    try {
      return await axios.get(this.api + "api/entity/partialBundle", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      });
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async getDefinitionBundle(iri: string): Promise<PartialBundle> {
    try {
      return await axios.get(this.api + "api/entity/inferredBundle", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async getInferredAsString(iri: string): Promise<string> {
    try {
      return await axios.get(this.api + "api/entity/inferredAsString", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return "";
    }
  }

  public static async getAxiomBundle(iri: string): Promise<PartialBundle> {
    try {
      return await axios.get(this.api + "api/entity/axiomBundle", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async getAxiomAsString(iri: string): Promise<string> {
    try {
      return await axios.get(this.api + "api/entity/axiomAsString", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return "";
    }
  }

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<any> {
    try {
      const req: any = {
        size: request.size,
        query: {
          bool: {
            must: [],
            filter: []
          }
        }
      };

      for (const term of request.termFilter.split(" ")) {
        if (term) req.query.bool.must.push({ match_phrase_prefix: { name: term } });
      }

      if (request.schemeFilter && request.schemeFilter.length > 0) {
        req.query.bool.filter.push(this.getFilter("scheme.@id", request.schemeFilter));
      }

      if (request.statusFilter && request.statusFilter.length > 0) {
        req.query.bool.filter.push(this.getFilter("status.@id", request.statusFilter));
      }

      if (request.typeFilter && request.typeFilter.length > 0) {
        req.query.bool.filter.push(this.getFilter("entityType.@id", request.typeFilter));
      }

      return await axios.post(process.env.VUE_APP_OPENSEARCH_URL || "", req, {
        cancelToken: cancelToken,
        headers: {
          Authorization: "Basic " + process.env.VUE_APP_OPENSEARCH_AUTH
        }
      });
    } catch (error) {
      return {} as SearchResponse;
    }
  }

  private static getFilter(field: string, data: string[]): any {
    const types: any[] = [];
    for (const type of data) {
      const fieldValue: any = {};
      fieldValue[field] = type;
      types.push({ match_phrase: fieldValue });
    }

    return {
      bool: {
        should: types,
        minimum_should_match: 1
      }
    };
  }

  // public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<SearchResponse> {
  //   try {
  //     return await axios.post(this.api + "api/entity/search", request, {
  //       cancelToken: cancelToken
  //     });
  //   } catch (error) {
  //     return {} as SearchResponse;
  //   }
  // }

  //obsolete, to be deleted on editor branch merge
  public static async getEntity(iri: string): Promise<any> {
    try {
      return await axios.get(this.api + "api/entity", {
        params: { iri: iri }
      });
    } catch (error) {
      return {} as any;
    }
  }

  public static async getEntityDefinitionDto(iri: string): Promise<EntityDefinitionDto> {
    try {
      return await axios.get(this.api + "api/entity/definition", {
        params: { iri: iri }
      });
    } catch (error) {
      return {} as EntityDefinitionDto;
    }
  }

  public static async getEntityParents(iri: string, filters?: FiltersAsIris): Promise<EntityReferenceNode[]> {
    try {
      return await axios.get(this.api + "api/entity/parents", {
        params: { iri: iri, schemeIris: filters?.schemes.join(",") }
      });
    } catch (error) {
      return [] as EntityReferenceNode[];
    }
  }

  public static async getEntityChildren(iri: string, filters?: FiltersAsIris, cancelToken?: CancelToken): Promise<EntityReferenceNode[]> {
    try {
      return await axios.get(this.api + "api/entity/children", {
        params: { iri: iri, schemeIris: filters?.schemes.join(",") },
        cancelToken: cancelToken
      });
    } catch (error) {
      return [] as EntityReferenceNode[];
    }
  }

  public static async getEntityUsages(iri: string, pageIndex: number, pageSize: number): Promise<TTIriRef[]> {
    try {
      return await axios.get(this.api + "api/entity/usages", {
        params: {
          iri: iri,
          page: pageIndex,
          size: pageSize
        }
      });
    } catch (error) {
      return [] as TTIriRef[];
    }
  }

  public static async getUsagesTotalRecords(iri: string): Promise<number> {
    try {
      return await axios.get(this.api + "api/entity/usagesTotalRecords", {
        params: {
          iri: iri
        }
      });
    } catch (error) {
      return 0;
    }
  }

  public static async getEntityMembers(iri: string, expandMembers?: boolean, expandSubsets?: boolean, limit?: number): Promise<ExportValueSet> {
    try {
      return await axios.get(this.api + "api/entity/members", {
        params: {
          iri: iri,
          expandMembers: expandMembers,
          expandSubsets: expandSubsets,
          limit: limit
        }
      });
    } catch (error) {
      return {} as ExportValueSet;
    }
  }

  public static async getEntityGraph(iri: string): Promise<GraphData> {
    try {
      return await axios.get(this.api + "api/entity/graph", { params: { iri: iri } });
    } catch (error) {
      return {} as GraphData;
    }
  }

  public static async getEntityTermCodes(iri: string): Promise<TermCode[]> {
    try {
      return await axios.get(this.api + "api/entity/termCode", {
        params: { iri: iri }
      });
    } catch (error) {
      return {} as TermCode[];
    }
  }

  public static async getDataModelProperties(iri: string): Promise<DataModelProperty[]> {
    try {
      return await axios.get(this.api + "api/entity/dataModelProperties", {
        params: { iri: iri }
      });
    } catch (error) {
      return [] as DataModelProperty[];
    }
  }

  public static async getEntitySummary(iri: string): Promise<ConceptSummary> {
    try {
      return await axios.get(this.api + "api/entity/summary", {
        params: { iri: iri }
      });
    } catch (error) {
      return {} as ConceptSummary;
    }
  }

  public static async getNamespaces(): Promise<Namespace[]> {
    try {
      return await axios.get(this.api + "api/entity/namespaces");
    } catch (error) {
      return [] as Namespace[];
    }
  }

  public static async ECLSearch(searchString: string, includeLegacy: boolean, limit: number, cancelToken: CancelToken): Promise<SearchResponse> {
    try {
      return await axios.post(this.api + "api/set/eclSearch", searchString, {
        headers: { "Content-Type": "text/plain" },
        params: { includeLegacy: includeLegacy, limit: limit },
        cancelToken: cancelToken
      });
    } catch (error) {
      return {} as SearchResponse;
    }
  }

  public static async getEcl(bundle: TTBundle): Promise<string> {
    try {
      return await axios.post(this.api + "api/entity/ecl", bundle);
    } catch (error) {
      return "";
    }
  }
}
