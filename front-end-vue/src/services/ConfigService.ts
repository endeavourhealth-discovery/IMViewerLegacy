import axios from "axios";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<any[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/config/componentLayout", {
        params: {
          name: name
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : [];
  }

  public static async getFilterDefaults(): Promise<any[]> {
    const axiosReturn = (await axios.get(this.api + "api/config/filterDefaults")).data;
    return axiosReturn ? axiosReturn : [];
  }
}
