export interface TransformInputUpload {
  id: string;
  inputFile: File;
  inputJson: any[];
  inputDisplayJson: any[];
  dataModel: any;
}

export interface JoinInstruction {
  dataA: string;
  dataB: string;
  propertyA: string;
  propertyB: string;
  joinType: string;
  nestedPropertyName: string;
}
