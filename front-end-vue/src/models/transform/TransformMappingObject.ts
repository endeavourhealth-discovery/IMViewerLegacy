export default interface TransformMappingObject {
  destinationPath: string;
  transformType: string;
  transformValue: string | string[];
  property: string | undefined;
  example: string | undefined;
  exampleTransformed: string | undefined;
}
