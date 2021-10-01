import axios, { AxiosResponse } from "axios";

export default class CatalogueService {
  static api = process.env.VUE_APP_API;

  public static async getSearchResult(
    request: string,
    typesIris: string[]
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "instance/search", {
      params: { request: request, typesIris: typesIris.join(",")}
    });
  }

  public static async getPartialInstance(
    iri: string,
    predicates: string[]
  ): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "instance/partial", {
      params: { iri: iri, predicate: predicates }
    });
  }

  public static async getTypesCount(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "instance/typesCount");
  }
}
