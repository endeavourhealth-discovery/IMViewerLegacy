import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { DefinitionType } from "@/models/definition/DefinitionType";

export function generateNewComponent(type: DefinitionType, position: number, data: any) {
  let result;
  switch (type) {
    case DefinitionType.LOGIC:
      result = {
        id: DefinitionType.LOGIC + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.LOGIC,
        json: {},
        component: DefinitionComponent.LOGIC
      };
      break;
    case DefinitionType.PARENT:
      result = {
        id: DefinitionType.PARENT + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.PARENT,
        json: {},
        component: DefinitionComponent.PARENT
      };
      break;
    case DefinitionType.MEMBER:
      result = {
        id: DefinitionType.MEMBER + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.MEMBER,
        json: {},
        component: DefinitionComponent.MEMBER
      };
      break;
    case DefinitionType.SET:
      result = {
        id: DefinitionType.SET + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.SET,
        json: {},
        component: DefinitionComponent.SET
      };
      break;
    case DefinitionType.REFINEMENT:
      result = {
        id: DefinitionType.REFINEMENT + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.REFINEMENT,
        json: {},
        component: DefinitionComponent.REFINEMENT
      };
      break;
    case DefinitionType.PROPERTY:
      result = {
        id: DefinitionType.PROPERTY + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.PROPERTY,
        json: {},
        component: DefinitionComponent.PROPERTY
      };
      break;
    case DefinitionType.QUANTIFIER:
      result = {
        id: DefinitionType.QUANTIFIER + "_" + position,
        value: data,
        position: position,
        type: DefinitionType.QUANTIFIER,
        json: {},
        component: DefinitionComponent.QUANTIFIER
      };
      break;
    default:
      break;
  }
  return result;
}

export function genNextOptions(position: number, previous: DefinitionType, group?: DefinitionType) {
  return {
    id: "addNext_" + (position + 1),
    value: {
      previousPosition: position,
      previousComponentType: previous,
      parentGroup: group
    },
    position: position + 1,
    type: DefinitionType.ADD_NEXT,
    json: {},
    component: DefinitionComponent.ADD_NEXT
  };
}
