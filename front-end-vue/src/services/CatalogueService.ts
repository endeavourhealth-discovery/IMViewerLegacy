import axios from "axios";

export default class CatalogueService {
  static api = process.env.VUE_APP_API;

  public static async getSearchResult(request: string, typesIris: string[]): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "instance/search", {
        params: { request: request, typesIris: typesIris.join(",") }
      })) as [];
      return axiosReturn || [];
    } catch (error) {
      return [];
    }
  }

  public static async getPartialInstance(iri: string, predicates: string[]): Promise<any> {
    try {
      const axiosReturn = (
        await axios.get(this.api + "instance/partial", {
          params: { iri: iri, predicate: predicates }
        })
      ).data;
      return axiosReturn || {};
    } catch (error) {
      return {};
    }
  }

  public static async getTypesCount(): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "instance/typesCount")).data;
      return axiosReturn || [];
    } catch (error) {
      return [];
    }
  }
}
