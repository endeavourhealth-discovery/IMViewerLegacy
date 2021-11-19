import { TransformInputUpload, JoinInstruction } from "@/models/transform/TransformInputUpload";
import axios from "axios";

export default class TransformService {
  static api = "http://127.0.0.1:5000/";

  public static async join(inputs: TransformInputUpload[], instructions: JoinInstruction[]): Promise<any[]> {
    try {
      return await axios.post(this.api + "api/transform/join", { inputs, instructions });
    } catch (error) {
      return [] as any[];
    }
  }
}
