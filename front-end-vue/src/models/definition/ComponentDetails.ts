import { DefinitionComponent } from "./DefinitionComponent";
import { DefinitionType } from "./DefinitionType";

export interface ComponentDetails {
  id: string;
  value: any;
  position: number;
  type: DefinitionType;
  json: any;
  component: DefinitionComponent;
}
