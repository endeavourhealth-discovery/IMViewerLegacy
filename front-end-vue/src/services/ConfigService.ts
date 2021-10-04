import axios, { AxiosResponse } from "axios";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<any> {
    return (
      await axios.get(this.api + "api/config/componentLayout", {
        params: {
          name: name
        }
      })
    ).data;
  }

  public static async getFilterDefaults(): Promise<any> {
    return (await axios.get(this.api + "api/config/filterDefaults")).data;
  }
}
