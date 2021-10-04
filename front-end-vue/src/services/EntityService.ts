import { SearchRequest } from "@/models/search/SearchRequest";
import axios, { AxiosResponse, CancelToken } from "axios";
import { ConceptNode } from "@/models/ConceptNode";
import { IM } from "@/vocabulary/IM";

export default class EntityService {
  static api = process.env.VUE_APP_API;

  public static async getPartialEntity(iri: string, predicates: string[]): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/partial", {
        params: {
          iri: iri,
          predicate: predicates.join(",")
        }
      })
    ).data;
  }

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<any> {
    return (
      await axios.post(this.api + "api/entity/search", request, {
        cancelToken: cancelToken
      })
    ).data;
  }

  public static async getEntity(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getEntityDefinitionDto(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/definition", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getEntityImLang(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity", {
        params: { iri: iri },
        headers: {
          accept: "application/imlang"
        },
        responseType: "text"
      })
    ).data;
  }

  public static async getEntityParents(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/parents", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getEntityChildren(iri: string, cancelToken?: CancelToken): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/children", {
        params: { iri: iri },
        cancelToken: cancelToken
      })
    ).data;
  }

  public static async getEntityUsages(iri: string, pageIndex: number, pageSize: number): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/usages", {
        params: {
          iri: iri,
          page: pageIndex,
          size: pageSize
        }
      })
    ).data;
  }

  public static async getUsagesTotalRecords(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/usagesTotalRecords", {
        params: {
          iri: iri
        }
      })
    ).data;
  }

  public static async getEntityMembers(iri: string, expandMembers?: boolean, expandSubsets?: boolean, limit?: number): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/members", {
        params: {
          iri: iri,
          expandMembers: expandMembers,
          expandSubsets: expandSubsets,
          limit: limit
        }
      })
    ).data;
  }

  public static async getSchemeOptions(): Promise<any> {
    return this.getEntityChildren(IM.CODE_SCHEME);
  }

  public static saveEntity(concept: any) {
    return axios.post(this.api + "api/entity", concept);
  }

  public static async getEntityGraph(iri: string): Promise<any> {
    return (await axios.get(this.api + "api/entity/graph", { params: { iri: iri } })).data;
  }

  public static async getEntityTermCodes(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/termCode", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getSemanticProperties(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/semanticProperties", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getDataModelProperties(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/dataModelProperties", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getComplexMappings(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/complexMappings", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getEntitySummary(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/summary", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getNamespaces(): Promise<any> {
    return (await axios.get(this.api + "api/entity/namespaces")).data;
  }

  public static async getComplexMembers(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/complexMembers", {
        params: { iri: iri }
      })
    ).data;
  }

  public static async getAxioms(iri: string): Promise<any> {
    return (
      await axios.get(this.api + "api/entity/axioms", {
        params: { iri: iri }
      })
    ).data;
  }
}
