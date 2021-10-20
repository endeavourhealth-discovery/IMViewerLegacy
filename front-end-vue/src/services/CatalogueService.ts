import axios from "axios";

export default class CatalogueService {
  static api = process.env.VUE_APP_API;

  public static async getSearchResult(request: string, typesIris: string[]): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "instance/search", {
        params: { request: request, typesIris: typesIris.join(",") }
      })) as any[];
      return axiosReturn || ([] as any[]);
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getPartialInstance(iri: string, predicates: string[]): Promise<any> {
    try {
      const axiosReturn = (await axios.get(this.api + "instance/partial", {
        params: { iri: iri, predicate: predicates }
      })) as any;
      return axiosReturn || ({} as any);
    } catch (error) {
      return {} as any;
    }
  }

  public static async getTypesCount(): Promise<any[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "instance/typesCount")) as any[];
      return axiosReturn || ([] as any[]);
    } catch (error) {
      return [] as any[];
    }
  }
}
