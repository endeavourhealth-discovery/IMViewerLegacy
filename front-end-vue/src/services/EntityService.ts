import { SearchRequest } from "@/models/search/SearchRequest";
import { ConceptDto } from "@/models/ConceptDto";
import axios, { AxiosResponse, CancelToken } from "axios";
import { ConceptNode } from "@/models/TTConcept/ConceptNode";
import {IM} from "@/vocabulary/IM";

export default class EntityService {
    public static async getPartialEntity(iri: string, predicates: string[]): Promise<AxiosResponse<any>> {
        return axios.get(this.api + "api/entity/partial", {
            params: {
                iri: iri,
                predicate: predicates.join(",")
            }
        });
    }

  public static async getDataModelProperties(
    iri: string,
    cancelToken: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/dataModelProperties", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }
  static api = process.env.VUE_APP_API;

  public static async advancedSearch(
    request: SearchRequest,
    cancelToken: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity/search", request, {
      cancelToken: cancelToken
    });
  }

  public static async getEntity(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri }
    });
  }

  public static async getEntityDefinitionDto(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/definition", {
      params: { iri: iri }
    });
  }

  public static async getEntityImLang(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri },
      headers: {
        accept: "application/imlang"
      },
      responseType: "text"
    });
  }

  public static async getEntityParents(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/parents", {
      params: { iri: iri }
    });
  }

  public static async getEntityChildren(
    iri: string,
    cancelToken?: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/children", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }

  public static async getEntityUsages(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/usages", { params: { iri: iri } });
  }

  public static async getEntityMembers(
    iri: string,
    expanded: boolean
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/members", {
      params: { iri: iri, expanded: expanded }
    });
  }

  public static async getSchemeOptions(): Promise<AxiosResponse<any>> {
    return this.getEntityChildren(IM.CODE_SCHEME);
  }

  public static async saveEntity(
    conceptDto: ConceptDto
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity", conceptDto);
  }

  public static getEntityProperties(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/properties", {
      params: { iri: iri }
    });
  }

  public static getEntityRoles(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/roles", {
      params: { iri: iri }
    });
  }

  public static getEntityGraph(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/graph", { params: { iri: iri } });
  }

  public static getEntitySynonyms(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/synonyms", {
      params: { iri: iri }
    });
  }

  public static getEntityTermCodes(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/termCode", {
      params: { iri: iri }
    });
  }

  public static getRecordStructure(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/recordStructure", {
      params: { iri: iri }
    });
  }

  public static getDefinitionSubTypes(
    iri: string,
    cancelToken?: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/definitionSubTypes", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }

  public static getComplexMappings(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/complexMappings", {
      params: { iri: iri }
    });
  }

  public static getEntitySummary(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/summary", {
      params: { iri: iri }
    });
  }
}
