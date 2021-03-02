import { ConceptReference } from "@/models/ConceptReference";
import axios, { AxiosResponse } from "axios";

export default class SuggestionService {
  static api = "http://localhost:8080/";

  public static async getIriSuggestions(
    keyword: string,
    word: string
  ): Promise<ConceptReference[]> {
    try {
      const response = await axios.get<ConceptReference[]>(
        this.api + "api/concept/referenceSuggestions",
        {
          params: {
            keyword: keyword,
            word: word,
          },
        }
      );
      if (response.status !== 200) {
        return [{ name: "test", iri: "123" }];
      }

      return response.data;
    } catch (error) {
      return [{ iri: "123", name: "test" }];
    }
    return [];
  }
}
