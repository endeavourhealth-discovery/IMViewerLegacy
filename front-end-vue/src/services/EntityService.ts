import { SearchRequest } from "@/models/search/SearchRequest";
import axios, { AxiosResponse, CancelToken } from "axios";
import { ConceptNode } from "@/models/ConceptNode";
import { IM } from "@/vocabulary/IM";

export default class EntityService {
  public static async getPartialEntity(iri: string, predicates: string[]): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/partial", {
      params: {
        iri: iri,
        predicate: predicates.join(",")
      }
    });
  }

  static api = process.env.VUE_APP_API;

  public static async advancedSearch(request: SearchRequest, cancelToken: CancelToken): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity/search", request, {
      cancelToken: cancelToken
    });
  }

  public static async getEntity(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri }
    });
  }

  public static async getEntityDefinitionDto(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/definition", {
      params: { iri: iri }
    });
  }

  public static async getEntityImLang(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity", {
      params: { iri: iri },
      headers: {
        accept: "application/imlang"
      },
      responseType: "text"
    });
  }

  public static async getEntityParents(iri: string): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/parents", {
      params: { iri: iri }
    });
  }

  public static async getEntityChildren(iri: string, cancelToken?: CancelToken): Promise<AxiosResponse<any>> {
    return axios.get<ConceptNode[]>(this.api + "api/entity/children", {
      params: { iri: iri },
      cancelToken: cancelToken
    });
  }

  public static async getEntityUsages(iri: string, pageIndex: number, pageSize: number): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/usages", {
      params: {
        iri: iri,
        page: pageIndex,
        size: pageSize
      }
    });
  }

  public static async getUsagesTotalRecords(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/usagesTotalRecords", {
      params: {
        iri: iri
      }
    });
  }

  public static async getEntityMembers(iri: string, expandMembers?: boolean, expandSubsets?: boolean, limit?: number): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/members", {
      params: {
        iri: iri,
        expandMembers: expandMembers,
        expandSubsets: expandSubsets,
        limit: limit
      }
    });
  }

  public static async getSchemeOptions(): Promise<AxiosResponse<any>> {
    return this.getEntityChildren(IM.CODE_SCHEME);
  }

  public static async saveEntity(concept: any): Promise<AxiosResponse<any>> {
    return axios.post(this.api + "api/entity", concept);
  }

  public static getEntityGraph(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/graph", { params: { iri: iri } });
  }

  public static getEntityTermCodes(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/termCode", {
      params: { iri: iri }
    });
  }

  public static getSemanticProperties(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/semanticProperties", {
      params: { iri: iri }
    });
  }

  public static getDataModelProperties(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/dataModelProperties", {
      params: { iri: iri }
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

  public static getNamespaces(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/namespaces");
  }

  public static getComplexMembers(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/complexMembers", {
      params: { iri: iri }
    });
  }

  public static getAxioms(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/entity/axioms", {
      params: { iri: iri }
    });
  }

  // public static getEntityShape(iri: string): Promise<AxiosResponse<any>> {
  //   return axios.get(this.api + "api/entity/shape", {
  //     params: { iri: iri }
  //   });
  // }

  public static getEntityShape(iri: string): Promise<any> {
    return new Promise(resolve => {
      resolve({
        data: {
          "@id": "http://endhealth.info/im#ClassShape",
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
            {
              "@id": "http://www.w3.org/ns/shacl#NodeShape",
              name: "Node shape"
            },
            {
              "@id": "http://www.w3.org/2002/07/owl#Class",
              name: "Class"
            }
          ],
          "http://www.w3.org/ns/shacl#property": [
            {
              "http://www.w3.org/ns/shacl#path": {
                "@id": "http://www.w3.org/2000/01/rdf-schema#subClassOf",
                name: "subClassOf"
              },
              "http://www.w3.org/ns/shacl#node": {
                "@id": "http://endhealth.info/im#ClassExpressionShape",
                name: "Class expression shape"
              }
            },
            {
              "http://www.w3.org/ns/shacl#path": {
                "@id": "http://www.w3.org/2002/07/owl#equivalentClass",
                name: "equivalentClass"
              },
              "http://www.w3.org/ns/shacl#node": {
                "@id": "http://endhealth.info/im#ClassExpressionShape",
                name: "Class expression shape"
              }
            }
          ],
          "http://endhealth.info#isA": [
            {
              "@id": "http://endhealth.info/im#ConceptShape",
              name: "Concept shape"
            }
          ],
          "http://www.w3.org/2000/01/rdf-schema#subClassOf": [
            {
              "@id": "http://endhealth.info/im#ConceptShape",
              name: "Concept shape"
            }
          ],
          "http://www.w3.org/2000/01/rdf-schema#comment": "The schema for the definition of a Class concept",
          "http://www.w3.org/2000/01/rdf-schema#label": "Class shape"
        }
      });
    });
  }
}
