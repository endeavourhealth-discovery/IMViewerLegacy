import { MapDocument } from "@/models/mapping/MapDocument";
import { MapDocumentError } from "@/models/mapping/MapDocumentError";
import axios from "axios";

export default class MappingService {
  static api = process.env.VUE_APP_API;

  public static async getMappedTTDocument(formData: FormData): Promise<any> {
    const response = await axios.post(this.api + "api/mapping", formData);
    return response.data;
  }

  public static async getNewPredicates(formData: FormData): Promise<string[]> {
    const response = await axios.post(this.api + "api/mapping/newPredicates", formData);
    return response.data;
  }

  static async getReferenceSuggestions(formData: FormData): Promise<string[]> {
    const response = await axios.post(this.api + "api/mapping/references", formData);
    return response.data;
  }

  static async getMapDocuments(): Promise<MapDocument[]> {
    const response = await axios.get(this.api + "api/mapping/mapDocument");
    return response.data;
  }

  static async getMapDocument(id: number): Promise<MapDocument> {
    const response = await axios.get(this.api + "api/mapping/mapDocument/" + id);
    return response.data;
  }

  static async getMapDocumentError(formData: FormData): Promise<MapDocumentError> {
    const response = await axios.post(this.api + "api/mapping/mapDocument/errors", formData);
    return response.data;
  }
}
