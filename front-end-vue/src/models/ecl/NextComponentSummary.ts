import { ECLType } from "../expressionConstraintsLanguage/ECLType";

export interface NextComponentSummary {
  previousComponent: ECLType;
  previousPosition: number;
  parentGroup?: ECLType;
}
