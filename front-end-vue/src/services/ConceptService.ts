import { SearchRequest } from './../models/search/SearchRequest';
import { ConceptDto } from "@/models/ConceptDto";
import axios from "axios";

export default class ConceptService {
  static api = process.env.VUE_APP_API;

  public static async advancedSearch(request: SearchRequest) {
    return axios.post(this.api + "api/concept/search", request);
  }

  public static async getConcept(iri: string) {
    return axios.get(this.api + "api/concept/" + iri);
  }

  public static async getConceptParentHierarchy(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parentHierarchy");
  }

  public static async getConceptParents(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parents");
  }

  public static async getConceptChildren(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/children");
  }
  
  public static async getConceptUsages(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/usages");
  }

  public static async getConceptMappedFrom(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/mappedFrom");
  }

  public static async getConceptMappedTo(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/mappedTo");
  }

  public static async getConceptMembers(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/members");
  }

  public static async getAncestorDefinitions(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parents/definitions");
  }

  public static async getSchemeOptions() {
    return this.getConceptChildren(":551000252107");
  }

  public static async saveConcept(conceptDto: ConceptDto) {
    return axios.post(this.api + "api/concept", conceptDto);
  }

  public static async getConceptImLang(iri: string) {
    return axios.get(this.api + "api/concept/" + iri, {
      headers: {
        accept: "application/imlang",
      },
      responseType: "text",
    });
  }

  public static getConceptProperties(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/properties");
  }

  public static getConceptGraph(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/graph");
  }
}
