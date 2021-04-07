import { SearchRequest } from "@/models/search/SearchRequest";
import { ConceptDto } from "@/models/ConceptDto";
import axios from "axios";
import { ConceptReferenceNode } from "@/models/ConceptReferenceNode";

export default class ConceptService {
  static api = process.env.VUE_APP_API;

  public static async advancedSearch(request: SearchRequest) {
    return axios.post(this.api + "api/concept/search", request);
  }

  public static async getConcept(iri: string) {
    return axios.get(this.api + "api/concept", { params: { iri: iri }});
  }

  public static async getConceptParents(iri: string) {
    return axios.get(this.api + "api/concept/parents", { params: { iri: iri }});
  }

  public static async getConceptChildren(iri: string) {
    return axios.get<ConceptReferenceNode[]>(this.api + "api/concept/children", { params: { iri: iri }});
  }

  public static async getConceptUsages(iri: string) {
    return axios.get(this.api + "api/concept/usages", { params: { iri: iri }});
  }

  public static async getConceptMappedFrom(iri: string) {
    return axios.get(this.api + "api/concept/mappedFrom", { params: { iri: iri }});
  }

  public static async getConceptMappedTo(iri: string) {
    return axios.get(this.api + "api/concept/mappedTo", { params: { iri: iri }});
  }

  public static async getConceptMembers(iri: string, expanded: boolean) {
    return axios.get(this.api + "api/concept/members", { params: { iri: iri, expanded: expanded }});
  }

  public static async getAncestorDefinitions(iri: string) {
    return axios.get(this.api + "api/concept/parents/definitions", { params: { iri: iri }});
  }

  public static async getSchemeOptions() {
    return this.getConceptChildren(":551000252107");
  }

  public static async saveConcept(conceptDto: ConceptDto) {
    return axios.post(this.api + "api/concept", conceptDto);
  }

  public static async getConceptImLang(iri: string) {
    return axios.get(this.api + "api/concept", {
        params: { iri: iri },
      headers: {
        accept: "application/imlang"
      },
      responseType: "text"
    });
  }

  public static getConceptProperties(iri: string) {
    return axios.get(this.api + "api/concept/properties", { params: { iri: iri }});
  }

  public static getConceptGraph(iri: string) {
    return axios.get(this.api + "api/concept/graph", { params: { iri: iri }});
  }

  public static getConceptSynonyms(iri: string){
    return axios.get(this.api + "api/concept/synonyms", { params: { iri: iri }});
  }
}
