import { SearchRequest } from "@/models/search/SearchRequest";
import axios, { CancelToken } from "axios";
import { IM } from "@/vocabulary/IM";
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
import { isObjectHasKeys } from "@/helpers/DataTypeCheckers";

export default class EntityService {
  static api = process.env.VUE_APP_API;

  public static async getMatchedFrom(iri: string): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/matchedFrom", {
        params: {
          iri: iri
        }
      })) as any[];
      return axiosReturn || ([] as any[]);
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getPartialEntity(iri: string, predicates: string[]): Promise<any> {
    try {
      const axiosReturn = await axios.get(this.api + "api/entity/partial", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      });
      return axiosReturn || ({} as any);
    } catch (error) {
      return {} as any;
    }
  }

  public static async getPartialEntityBundle(iri: string, predicates: string[]): Promise<PartialBundle> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/partialBundle", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      })) as PartialBundle;
      return axiosReturn || ({} as PartialBundle);
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async getInferredBundle(iri: string): Promise<PartialBundle> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/inferredBundle", {
        params: {
          iri: iri
        }
      })) as PartialBundle;
      if (isObjectHasKeys(axiosReturn, ["entity", "predicates"]) && Object.keys(axiosReturn.entity).length > 1) {
        return axiosReturn;
      }
      return {} as PartialBundle;
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async getAxiomBundle(iri: string): Promise<PartialBundle> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/axiomBundle", {
        params: {
          iri: iri
        }
      })) as PartialBundle;
      if (isObjectHasKeys(axiosReturn, ["entity", "predicates"]) && Object.keys(axiosReturn.entity).length > 1) {
        return axiosReturn;
      }
      return {} as PartialBundle;
    } catch (error) {
      return {} as PartialBundle;
    }
  }

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<SearchResponse> {
    try {
      const axiosReturn = (await axios.post(this.api + "api/entity/search", request, {
        cancelToken: cancelToken
      })) as SearchResponse;
      return axiosReturn || ({} as SearchResponse);
    } catch (error) {
      return {} as SearchResponse;
    }
  }

  //obsolete, to be deleted on editor branch merge
  public static async getEntity(iri: string): Promise<any> {
    try {
      const axiosReturn = await axios.get(this.api + "api/entity", {
        params: { iri: iri }
      });
      return axiosReturn || ({} as any);
    } catch (error) {
      return {} as any;
    }
  }

  public static async getEntityDefinitionDto(iri: string): Promise<EntityDefinitionDto> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/definition", {
        params: { iri: iri }
      })) as EntityDefinitionDto;
      return axiosReturn || ({} as EntityDefinitionDto);
    } catch (error) {
      return {} as EntityDefinitionDto;
    }
  }

  public static async getEntityParents(iri: string): Promise<EntityReferenceNode[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/parents", {
        params: { iri: iri }
      })) as EntityReferenceNode[];
      return axiosReturn || ([] as EntityReferenceNode[]);
    } catch (error) {
      return [] as EntityReferenceNode[];
    }
  }

  public static async getEntityChildren(iri: string, cancelToken?: CancelToken): Promise<EntityReferenceNode[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/children", {
        params: { iri: iri },
        cancelToken: cancelToken
      })) as EntityReferenceNode[];
      return axiosReturn || ([] as EntityReferenceNode[]);
    } catch (error) {
      return [] as EntityReferenceNode[];
    }
  }

  public static async getEntityUsages(iri: string, pageIndex: number, pageSize: number): Promise<TTIriRef[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/usages", {
        params: {
          iri: iri,
          page: pageIndex,
          size: pageSize
        }
      })) as TTIriRef[];
      return axiosReturn || ([] as TTIriRef[]);
    } catch (error) {
      return [] as TTIriRef[];
    }
  }

  public static async getUsagesTotalRecords(iri: string): Promise<number> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/usagesTotalRecords", {
        params: {
          iri: iri
        }
      })) as number;
      return axiosReturn || 0;
    } catch (error) {
      return 0;
    }
  }

  public static async getEntityMembers(iri: string, expandMembers?: boolean, expandSubsets?: boolean, limit?: number): Promise<ExportValueSet> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/members", {
        params: {
          iri: iri,
          expandMembers: expandMembers,
          expandSubsets: expandSubsets,
          limit: limit
        }
      })) as ExportValueSet;
      return axiosReturn || ({} as ExportValueSet);
    } catch (error) {
      return {} as ExportValueSet;
    }
  }

  public static async getEntityGraph(iri: string): Promise<GraphData> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/graph", { params: { iri: iri } })) as GraphData;
      return axiosReturn || ({} as GraphData);
    } catch (error) {
      return {} as GraphData;
    }
  }

  public static async getEntityTermCodes(iri: string): Promise<TermCode[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/termCode", {
        params: { iri: iri }
      })) as TermCode[];
      return axiosReturn || ([] as TermCode[]);
    } catch (error) {
      return {} as TermCode[];
    }
  }

  public static async getDataModelProperties(iri: string): Promise<DataModelProperty[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/dataModelProperties", {
        params: { iri: iri }
      })) as DataModelProperty[];
      return axiosReturn || ([] as DataModelProperty[]);
    } catch (error) {
      return [] as DataModelProperty[];
    }
  }

  public static async getEntitySummary(iri: string): Promise<ConceptSummary> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/summary", {
        params: { iri: iri }
      })) as ConceptSummary;
      return axiosReturn || ({} as ConceptSummary);
    } catch (error) {
      return {} as ConceptSummary;
    }
  }

  public static async getNamespaces(): Promise<Namespace[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/namespaces")) as Namespace[];
      return axiosReturn || ([] as Namespace[]);
    } catch (error) {
      return [] as Namespace[];
    }
  }

  public static async getComplexMembers(iri: string): Promise<string[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/entity/complexMembers", {
        params: { iri: iri }
      })) as string[];
      return axiosReturn || ([] as string[]);
    } catch (error) {
      return [] as string[];
    }
  }
}
