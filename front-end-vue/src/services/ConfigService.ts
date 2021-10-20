import axios from "axios";
import { FilterDefaultsConfig } from "@/models/configs/FilterDefaultsConfig";
import { DefinitionConfig } from "@/models/configs/DefinitionConfig";
import { DashboardLayout } from "@/models/configs/DashboardLayout";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<DefinitionConfig[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/config/componentLayout", {
        params: {
          name: name
        }
      })) as DefinitionConfig[];
      return axiosReturn || ([] as DefinitionConfig[]);
    } catch (error) {
      return [] as DefinitionConfig[];
    }
  }

  public static async getFilterDefaults(): Promise<FilterDefaultsConfig> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/config/filterDefaults")) as FilterDefaultsConfig;
      return axiosReturn || ({} as FilterDefaultsConfig);
    } catch (error) {
      return {} as FilterDefaultsConfig;
    }
  }

  public static async getDashboardLayout(name: string): Promise<DashboardLayout[]> {
    try {
      const axiosReturn = (await axios.get(this.api + "api/config/dashboardLayout", {
        params: {
          name: name
        }
      })) as DashboardLayout[];
      return axiosReturn ? axiosReturn : ([] as DashboardLayout[]);
    } catch (error) {
      return [] as DashboardLayout[];
    }
  }
}
