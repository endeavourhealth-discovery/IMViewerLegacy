import axios from "axios";
import { FilterDefaultsConfig } from "@/models/configs/FilterDefaultsConfig";
import { DefinitionConfig } from "@/models/configs/DefinitionConfig";
import { DashboardLayout } from "@/models/configs/DashboardLayout";

export default class ConfigService {
  static api = process.env.VUE_APP_API;

  public static async getComponentLayout(name: string): Promise<DefinitionConfig[]> {
    try {
      return await axios.get(this.api + "api/config/componentLayout", {
        params: {
          name: name
        }
      });
    } catch (error) {
      return [] as DefinitionConfig[];
    }
  }

  public static async getFilterDefaults(): Promise<FilterDefaultsConfig> {
    try {
      return await axios.get(this.api + "api/config/filterDefaults");
    } catch (error) {
      return {} as FilterDefaultsConfig;
    }
  }

  public static async getDashboardLayout(name: string): Promise<DashboardLayout[]> {
    try {
      return await axios.get(this.api + "api/config/dashboardLayout", {
        params: {
          name: name
        }
      });
    } catch (error) {
      return [] as DashboardLayout[];
    }
  }

  public static async getDefaultPredicatenames(): Promise<any> {
    try {
      return await axios.get(this.api + "api/config/defaultPredicateNames");
    } catch (error) {
      return {} as any;
    }
  }

  public static async getXmlSchemaDataTypes(): Promise<any> {
    try {
      return await axios.get(this.api + "api/config/xmlSchemaDataTypes");
    } catch (error) {
      return [] as string[];
    }
  }
}
