export interface TransformInstruction {
  destinationPath: object;
  transformType: string;
  transformValue: object;
  transformFunctions: string[];
  example: string | undefined;
  exampleTransformed: string | undefined;
}

export interface TransformInstructionDto {
  destinationPath: string;
  transformType: string;
  transformValue: string;
  transformFunctions: string[];
  example: string | undefined;
  exampleTransformed: string | undefined;
}
