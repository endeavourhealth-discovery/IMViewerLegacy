import axios from "axios";
import { FilterDefaultsConfig } from "@/models/configs/FilterDefaultsConfig";
import { DefinitionConfig } from "@/models/configs/DefinitionConfig";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<DefinitionConfig[]> {
    const axiosReturn = (
      await axios.get(this.api + "api/config/componentLayout", {
        params: {
          name: name
        }
      })
    ).data;
    return axiosReturn ? axiosReturn : ([] as DefinitionConfig[]);
  }

  public static async getFilterDefaults(): Promise<FilterDefaultsConfig> {
    const axiosReturn = (await axios.get(this.api + "api/config/filterDefaults")).data;
    return axiosReturn ? axiosReturn : ({} as FilterDefaultsConfig);
  }
}
