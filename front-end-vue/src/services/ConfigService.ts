import axios, { AxiosResponse } from "axios";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getConfig(name: string): Promise<AxiosResponse<any>> {
    return axios.get(this.api + "api/config/componentLayout", {
      params: {
        name: name
      }
    });
  }
}
