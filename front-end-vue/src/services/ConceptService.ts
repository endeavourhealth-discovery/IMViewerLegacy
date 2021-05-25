import { SearchRequest } from "@/models/search/SearchRequest";
import { ConceptDto } from "@/models/ConceptDto";
import axios, { AxiosResponse, CancelToken } from "axios";
import { ConceptNode } from "@/models/TTConcept/ConceptNode";

export default class ConceptService {
  static api = process.env.VUE_APP_API;

  public static async advancedSearch(
    request: SearchRequest,
    cancelToken: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/concept/search", request, {
      cancelToken: cancelToken
    });
  }

  public static async getConcept(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept", {
      params: { iri: iri }
    });
  }

  public static async getConceptImLang(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept", {
      params: { iri: iri },
      headers: {
        accept: "application/imlang"
      },
      responseType: "text"
    });
  }

  public static async getConceptParents(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/concept/parents", {
      params: { iri: iri }
    });
  }

  public static async getConceptChildren(
    iri: string,
    cancelToken?: CancelToken
  ): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/concept/children", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }

  public static async getConceptUsages(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/usages", { params: { iri: iri } });
  }

  public static async getConceptMappedFrom(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/mappedFrom", {
      params: { iri: iri }
    });
  }

  public static async getConceptMappedTo(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/mappedTo", {
      params: { iri: iri }
    });
  }

  public static async getConceptMembers(
    iri: string,
    expanded: boolean
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/members", {
      params: { iri: iri, expanded: expanded }
    });
  }

  public static async getAncestorDefinitions(
    iri: string
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/parents/definitions", {
      params: { iri: iri }
    });
  }

  public static async getSchemeOptions(): Promise<AxiosResponse<any>> {
    const CancelToken = axios.CancelToken;
    return this.getConceptChildren("http://endhealth.info/im#551000252107");
  }

  public static async saveConcept(
    conceptDto: ConceptDto
  ): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/concept", conceptDto);
  }

  public static getConceptProperties(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/properties", {
      params: { iri: iri }
    });
  }

  public static getConceptRoles(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/roles", {
      params: { iri: iri }
    });
  }

  public static getConceptGraph(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/graph", { params: { iri: iri } });
  }

  public static getConceptSynonyms(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/synonyms", {
      params: { iri: iri }
    });
  }

  public static getConceptTermCodes(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/termCode", {
      params: { iri: iri }
    });
  }

  public static getRecordStructure(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/concept/recordStructure", {
      params: { iri: iri }
    });
  }
}
