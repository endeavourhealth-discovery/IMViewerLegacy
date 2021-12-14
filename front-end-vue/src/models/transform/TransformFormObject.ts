import { TransformInstructionDto } from "./TransformInstruction";

export default interface TransformFormObject {
  input: File;
  inputJson: any[];
  inputDisplayJson: any[];
  dataModel: File;
  dataModelJson: any;
  instructions: TransformInstructionDto[];
}
