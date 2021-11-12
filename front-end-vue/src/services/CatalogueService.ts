import axios, { CancelToken } from "axios";

export default class CatalogueService {
  static api = process.env.VUE_APP_API;

  public static async getSearchResult(request: string, typesIris: string[], cancelToken: CancelToken): Promise<any[]> {
    try {
      return await axios.get(this.api + "instance/search", {
        params: { request: request, typesIris: typesIris.join(",") },
        cancelToken: cancelToken
      });
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getPartialInstance(iri: string, predicates?: string[]): Promise<any> {
    try {
      return await axios.get(this.api + "instance/partial", {
        params: { iri: iri, predicate: predicates }
      });
    } catch (error) {
      return {} as any;
    }
  }

  public static async getTypesCount(): Promise<any[]> {
    try {
      return await axios.get(this.api + "instance/typesCount");
    } catch (error) {
      return [] as any[];
    }
  }
}
