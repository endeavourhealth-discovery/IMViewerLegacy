import { SearchRequest } from "@/models/search/SearchRequest";
import axios, { CancelToken } from "axios";
import GraphData from "@/models/GraphData";
import { EntityReferenceNode } from "@/models/EntityReferenceNode";
import { PartialBundle, SearchResponse } from "@/models/entityServiceTypes/EntityServiceTypes";
import { EntityDefinitionDto } from "@/models/EntityDefinitionDto";
import { TTIriRef } from "@/models/TripleTree";
import { ExportValueSet } from "@/models/members/ExportValueSet";
import { TermCode } from "@/models/terms/TermCode";
import { DataModelProperty } from "@/models/properties/DataModelProperty";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { Namespace } from "@/models/Namespace";
import { SearchString } from "@/models/search/SearchString";

export default class EntityService {
  static api = process.env.VUE_APP_API;

  public static async getMatchedFrom(iri: string): Promise<any[]> {
    try {
      return await axios.get(this.api + "api/entity/matchedFrom", {
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

  public static async getInferredBundle(iri: string): Promise<PartialBundle> {
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

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<SearchResponse> {
    try {
      return await axios.post(this.api + "api/entity/search", request, {
        cancelToken: cancelToken
      });
    } catch (error) {
      return {} as SearchResponse;
    }
  }

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

  public static async getEntityParents(iri: string): Promise<EntityReferenceNode[]> {
    try {
      return await axios.get(this.api + "api/entity/parents", {
        params: { iri: iri }
      });
    } catch (error) {
      return [] as EntityReferenceNode[];
    }
  }

  public static async getEntityChildren(iri: string, cancelToken?: CancelToken): Promise<EntityReferenceNode[]> {
    try {
      return await axios.get(this.api + "api/entity/children", {
        params: { iri: iri },
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

  public static async ECLSearch(searchString: string, includeLegacy: boolean, limit: number): Promise<SearchResponse> {
    try {
      return await axios.post(this.api + "api/set/eclSearch", searchString, {
        headers: { "Content-Type": "text/plain" },
        params: { includeLegacy: includeLegacy, limit: limit }
      });
    } catch (error) {
      console.log(error);
      return {} as SearchResponse;
    }
  }
}
