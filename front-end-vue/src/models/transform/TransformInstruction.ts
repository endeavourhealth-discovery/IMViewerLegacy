export interface TransformInstruction {
  destinationPath: any;
  transformType: string;
  transformValue: object;
  transformFunctions: string[];
  example: string | undefined;
  exampleTransformed: string | undefined;
}

export interface TransformInstructionDto {
  destinationPaths: string[];
  transformType: string;
  transformValue: string;
  transformFunctions: string[];
  example: string | undefined;
  exampleTransformed: string | undefined;
}
