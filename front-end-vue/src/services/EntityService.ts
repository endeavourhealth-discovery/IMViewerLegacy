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

export default class EntityService {
  static api = process.env.VUE_APP_API;

  public static async getPartialEntity(iri: string, predicates: string[]): Promise<any> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/partial", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : {};
  }

  public static async getPartialEntityBundle(iri: string, predicates: string[]): Promise<PartialBundle> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/partialBundle", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as PartialBundle);
  }

  public static async getInferredBundle(iri: string): Promise<PartialBundle> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/inferredBundle", {
        params: {
          iri: iri,
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as PartialBundle);
  }

  public static async getAxiomBundle(iri: string): Promise<PartialBundle> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/axiomBundle", {
        params: {
          iri: iri,
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as PartialBundle);
  }

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<SearchResponse> {
    const axiosReturn = (
      await axios.post(this.api + "api/entity/search", request, {
        cancelToken: cancelToken
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as SearchResponse);
  }

  //obsolete, to be deleted on editor branch merge
  public static async getEntity(iri: string): Promise<any> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : {};
  }

  public static async getEntityDefinitionDto(iri: string): Promise<EntityDefinitionDto> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/definition", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as EntityDefinitionDto);
  }

  public static async getEntityParents(iri: string): Promise<EntityReferenceNode[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/parents", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as EntityReferenceNode[]);
  }

  public static async getEntityChildren(iri: string, cancelToken?: CancelToken): Promise<EntityReferenceNode[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/children", {
        params: { iri: iri },
        cancelToken: cancelToken
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as EntityReferenceNode[]);
  }

  public static async getEntityUsages(iri: string, pageIndex: number, pageSize: number): Promise<TTIriRef[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/usages", {
        params: {
          iri: iri,
          page: pageIndex,
          size: pageSize
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as TTIriRef[]);
  }

  public static async getUsagesTotalRecords(iri: string): Promise<number> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/usagesTotalRecords", {
        params: {
          iri: iri
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : 0;
  }

  public static async getEntityMembers(iri: string, expandMembers?: boolean, expandSubsets?: boolean, limit?: number): Promise<ExportValueSet> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/members", {
        params: {
          iri: iri,
          expandMembers: expandMembers,
          expandSubsets: expandSubsets,
          limit: limit
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as ExportValueSet);
  }

  public static async getSchemeOptions(): Promise<EntityReferenceNode[]> {
    return this.getEntityChildren(IM.CODE_SCHEME);
  }

  public static async saveEntity(concept: any): Promise<any> {
    return await axios.post(this.api + "api/entity", concept);
  }

  public static async getEntityGraph(iri: string): Promise<GraphData> {
    const axiosReturn = (await axios.get(this.api + "api/entity/graph", { params: { iri: iri } })).data;
    return axiosReturn ? axiosReturn : ({} as GraphData);
  }

  public static async getEntityTermCodes(iri: string): Promise<TermCode[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/termCode", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as TermCode[]);
  }

  public static async getDataModelProperties(iri: string): Promise<DataModelProperty[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/dataModelProperties", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as DataModelProperty[]);
  }

  public static async getEntitySummary(iri: string): Promise<ConceptSummary> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/summary", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ({} as ConceptSummary);
  }

  public static async getNamespaces(): Promise<Namespace[]> {
    const axiosReturn = (await axios.get(this.api + "api/entity/namespaces")).data;
    return axiosReturn ? axiosReturn : ([] as Namespace[]);
  }

  public static async getComplexMembers(iri: string): Promise<string[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/entity/complexMembers", {
        params: { iri: iri }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as string[]);
  }
}
