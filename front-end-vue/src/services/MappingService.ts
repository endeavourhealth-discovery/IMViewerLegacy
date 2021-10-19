import { MapDocument } from "@/models/mapping/MapDocument";
import { MapDocumentError } from "@/models/mapping/MapDocumentError";
import axios from "axios";

export default class MappingService {
  static api = process.env.VUE_APP_API;

  public static async getMappedTTDocument(formData: FormData): Promise<any> {
    try {
      const response = (await axios.post(this.api + "api/mapping", formData)) as any;
      return response || ({} as any);
    } catch (error) {
      return {} as any;
    }
  }

  public static async getNewPredicates(formData: FormData): Promise<string[]> {
    try {
      const response = (await axios.post(this.api + "api/mapping/newPredicates", formData)) as string[];
      return response || ([] as string[]);
    } catch (error) {
      return [] as string[];
    }
  }

  static async getReferenceSuggestions(formData: FormData): Promise<string[]> {
    try {
      const response = (await axios.post(this.api + "api/mapping/references", formData)) as string[];
      return response || ([] as string[]);
    } catch (error) {
      return [] as string[];
    }
  }

  static async getMapDocuments(): Promise<MapDocument[]> {
    try {
      const response = (await axios.get(this.api + "api/mapping/mapDocument")) as MapDocument[];
      return response || ([] as MapDocument[]);
    } catch (error) {
      return [] as MapDocument[];
    }
  }

  static async getMapDocument(id: number): Promise<MapDocument> {
    try {
      const response = (await axios.get(this.api + "api/mapping/mapDocument/" + id)) as MapDocument;
      return response || ({} as MapDocument);
    } catch (error) {
      return {} as MapDocument;
    }
  }

  static async getMapDocumentError(formData: FormData): Promise<MapDocumentError> {
    try {
      const response = (await axios.post(this.api + "api/mapping/mapDocument/errors", formData)) as MapDocumentError;
      return response || ({} as MapDocumentError);
    } catch (error) {
      return {} as MapDocumentError;
    }
  }
}
