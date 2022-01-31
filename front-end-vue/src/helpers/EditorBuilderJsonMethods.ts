import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { DefinitionComponent } from "@/models/definition/DefinitionComponent";
import { DefinitionType } from "@/models/definition/DefinitionType";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";

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

export function genNextOptions(position: number, previous: DefinitionType, group?: DefinitionType): ComponentDetails {
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

export function updatePositions(build: ComponentDetails[]) {
  build.forEach((item: ComponentDetails, index: number) => {
    item.position = index;
  });
}

export function deleteItem(itemToDelete: ComponentDetails, build: ComponentDetails[], parentGroup: DefinitionType) {
  const index = build.findIndex(buildItem => buildItem.position === itemToDelete.position);
  build.splice(index, 1);
  const length = build.length;
  if (itemToDelete.position === 0) {
    build.unshift(genNextOptions(0, parentGroup, parentGroup));
  }
  if (index < length - 1 && build[index].type === DefinitionType.ADD_NEXT) {
    build[index] = genNextOptions(index - 1, build[index - 1].type, parentGroup);
  }
  if (build[length - 1].type !== DefinitionType.ADD_NEXT) {
    build.push(genNextOptions(length - 1, build[length - 1].type, parentGroup));
  } else {
    build[length - 1] = genNextOptions(length - 2, build[length - 2].type, parentGroup);
  }
  updatePositions(build);
}

export function updateItem(itemToUpdate: ComponentDetails, build: ComponentDetails[]) {
  const index = build.findIndex(buildItem => buildItem.position === itemToUpdate.position);
  build[index] = itemToUpdate;
}

export function addNextOptions(previousComponent: NextComponentSummary, build: ComponentDetails[]): ComponentDetails {
  const nextOptionsComponent = genNextOptions(previousComponent.previousPosition, previousComponent.previousComponentType, previousComponent.parentGroup);
  if (previousComponent.previousPosition !== build.length - 1 && build[previousComponent.previousPosition + 1].type === DefinitionType.ADD_NEXT) {
    build[previousComponent.previousPosition + 1] = nextOptionsComponent;
  } else {
    build.splice(previousComponent.previousPosition + 1, 0, nextOptionsComponent);
  }
  updatePositions(build);
  return nextOptionsComponent;
}

export function scrollIntoView(component: ComponentDetails) {
  const itemToScrollTo = document.getElementById(component.id);
  itemToScrollTo?.scrollIntoView();
}

export function addItem(itemToAdd: { selectedType: DefinitionType; position: number; value: any }, build: ComponentDetails[], parentGroup: DefinitionType) {
  const newComponent = generateNewComponent(itemToAdd.selectedType, itemToAdd.position, itemToAdd.value);
  if (!newComponent) return;
  build[itemToAdd.position] = newComponent;
  if (build[build.length - 1].type !== DefinitionType.ADD_NEXT) {
    build.push(genNextOptions(build.length - 1, build[build.length - 1].type, parentGroup));
  }
  updatePositions(build);
}
