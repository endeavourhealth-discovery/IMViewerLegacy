import axios, { AxiosResponse } from "axios";

export default class IndividualService {
  static api = process.env.VUE_APP_API;

  public static async getIndividual(iri: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/individual", { params: { iri: iri } });
  }

  public static async getConceptSchemeReport(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/report/concept/scheme");
  }

  public static async getConceptStatusReport(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/report/concept/status");
  }

  public static async getConceptCategoryReport(): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/report/concept/category");
  }
}
