import axios from "axios";

export default class ConceptService {
  api = "http://localhost:8080/";

  public async getConcept(iri: string) {
    return axios.get(this.api + "api/concept/" + iri);
  }

  public async getConceptParentHierarchy(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parentHierarchy");
  }

  public async getConceptParents(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parents");
  }

  public async getConceptChildren(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/children");
  }

  public async getAncestorDefinitions(iri: string) {
    return axios.get(this.api + "api/concept/" + iri + "/parents/definitions");
  }
}
