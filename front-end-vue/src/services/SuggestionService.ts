import { TTIriRef } from "@/models/TripleTree";
import axios from "axios";

export default class SuggestionService {
  static api = process.env.VUE_APP_API;

  public static async getIriSuggestions(keyword: string, word: string): Promise<TTIriRef[]> {
    const response = await axios.get<TTIriRef[]>(this.api + "api/entity/referenceSuggestions", {
      params: {
        keyword: keyword,
        word: word
      }
    });

    return response.data;
  }
}
