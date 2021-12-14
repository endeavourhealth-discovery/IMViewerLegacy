import { TransformInputUpload, JoinInstruction } from "@/models/transform/TransformInputUpload";
import { TransformInstructionDto } from "@/models/transform/TransformInstruction";
import axios from "axios";

export default class TransformService {
  static api = "http://127.0.0.1:3000/";

  public static async getTransformed(inputJson: any[], dataModelJson: any, instructions: TransformInstructionDto[]): Promise<any[]> {
    try {
      return await axios.post(this.api + "api/transform/transformed", { inputJson, dataModelJson, instructions });
    } catch (error) {
      return [] as any[];
    }
  }

  public static async getTransformTypes(): Promise<string[]> {
    try {
      return await axios.get(this.api + "api/transform/types");
    } catch (error) {
      return [] as string[];
    }
  }

  public static async getFunctions(): Promise<string[]> {
    try {
      return await axios.get(this.api + "api/transform/functions");
    } catch (error) {
      return [] as string[];
    }
  }

  public static async getDataModelInstanceDisplay(dataModelJson: any): Promise<any[]> {
    try {
      return await axios.post(this.api + "api/transform/datamodel/instance", dataModelJson);
    } catch (error) {
      return [] as any[];
    }
  }

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

  public static async getJpaths(input: any): Promise<string[]> {
    try {
      return await axios.post(this.api + "api/transform/jpathsFromInput", input);
    } catch (error) {
      return [] as string[];
    }
  }

  public static async getJpathTreeOptions(input: any): Promise<string[]> {
    try {
      return await axios.post(this.api + "api/transform/jpathTreeOptions", input);
    } catch (error) {
      return [] as string[];
    }
  }

  public static async transformByInstruction(
    instruction: TransformInstructionDto,
    instances: any[],
    input: any
  ): Promise<{ instruction: TransformInstructionDto; instances: any }> {
    try {
      return await axios.post(this.api + "api/transform/rowTransformation", { instruction, instances, input });
    } catch (error) {
      return {} as { instruction: TransformInstructionDto; instances: any };
    }
  }
}
