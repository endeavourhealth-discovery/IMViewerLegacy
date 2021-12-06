import { TransformInputUpload, JoinInstruction } from "@/models/transform/TransformInputUpload";
import axios from "axios";

export default class TransformService {
  public static async getDataModelInstanceDisplay(dataModelJson: any): Promise<any[]> {
    try {
      return await axios.post(this.api + "api/transform/datamodel/instance", dataModelJson);
    } catch (error) {
      return [] as any[];
    }
  }

  static api = "http://127.0.0.1:3000/";

  public static async join(inputs: TransformInputUpload[], instructions: JoinInstruction[]): Promise<TransformInputUpload[]> {
    try {
      return await axios.post(this.api + "api/transform/join", { inputs, instructions });
    } catch (error) {
      return [] as TransformInputUpload[];
    }
  }

  public static async getTransformInputUploadFromFile(fileString: string): Promise<any[]> {
    try {
      return await axios.post(this.api + "api/transform/transformInputUpload", { fileString });
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getInputFromJpath(input: TransformInputUpload, jpath: string): Promise<TransformInputUpload> {
    try {
      return await axios.post(this.api + "api/transform/inputFromJpath", { input, jpath });
    } catch (error) {
      return {} as TransformInputUpload;
    }
  }

  public static async getDataModel(input: TransformInputUpload): Promise<any> {
    try {
      return await axios.post(this.api + "api/transform/datamodel", input);
    } catch (error) {
      return {} as TransformInputUpload;
    }
  }

  public static async getJpaths(input: TransformInputUpload) {
    try {
      return await axios.post(this.api + "api/transform/jpathsFromInput", input);
    } catch (error) {
      return {} as TransformInputUpload;
    }
  }
}
