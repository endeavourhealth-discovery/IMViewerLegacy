export default interface TransformInstruction {
  destinationPath: string;
  transformType: string;
  transformValue: string;
  transformFunction: string[];
  property: string | undefined;
  example: string | undefined;
  exampleTransformed: string | undefined;
}
