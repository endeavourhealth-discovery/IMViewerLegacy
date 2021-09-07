import axios from "axios";

export default class MappingService {
  static api = process.env.VUE_APP_API;

  public static async getMappedTTDocument(formData: FormData): Promise<any> {
    const response = await axios.post(this.api + "api/mapping", formData);
    return response.data;
  }

  public static async getNewPredicates(formData: FormData) {
    const response = await axios.post(this.api + "api/mapping/newPredicates", formData);
    return response.data;
  }
}
