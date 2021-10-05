import axios, { AxiosResponse } from "axios";

export default class CatalogueService {
  static api = process.env.VUE_APP_API;

  public static async getSearchResult(request: string, typesIris: string[]): Promise<any[]> {
    const axiosReturn = (
      await axios.get(this.api + "instance/search", {
        params: { request: request, typesIris: typesIris.join(",") }
      })
    ).data;
    return axiosReturn ? axiosReturn : [];
  }

  public static async getPartialInstance(iri: string, predicates: string[]): Promise<any> {
    const axiosReturn = (
      await axios.get(this.api + "instance/partial", {
        params: { iri: iri, predicate: predicates }
      })
    ).data;
    return axiosReturn ? axiosReturn : {};
  }

  public static async getTypesCount(): Promise<any[]> {
    const axiosReturn = (await axios.get(this.api + "instance/typesCount")).data;
    return axiosReturn ? axiosReturn : [];
  }
}
