import { ComponentDetails } from "@/models/definition/ComponentDetails";
import { ComponentType } from "@/models/definition/ComponentType";
import { NextComponentSummary } from "@/models/definition/NextComponentSummary";

export function generateNewComponent(type: ComponentType, position: number, data: any) {
  let result;
  switch (type) {
    case ComponentType.LOGIC:
      result = {
        id: ComponentType.LOGIC + "_" + position,
        value: data,
        position: position,
        type: ComponentType.LOGIC,
        json: {},
        component: ComponentType.LOGIC
      };
      break;
    case ComponentType.ENTITY:
      result = {
        id: ComponentType.ENTITY + "_" + position,
        value: data,
        position: position,
        type: ComponentType.ENTITY,
        json: {},
        component: ComponentType.ENTITY
      };
      break;
    case ComponentType.QUANTIFIER:
      result = {
        id: ComponentType.QUANTIFIER + "_" + position,
        value: data,
        position: position,
        type: ComponentType.QUANTIFIER,
        json: {},
        component: ComponentType.QUANTIFIER
      };
      break;
    case ComponentType.REFINEMENT:
      result = {
        id: ComponentType.REFINEMENT + "_" + position,
        value: data,
        position: position,
        type: ComponentType.REFINEMENT,
        json: {},
        component: ComponentType.REFINEMENT
      };
      break;
    default:
      break;
  }
  return result;
}

export function genNextOptions(position: number, previous: ComponentType, group?: ComponentType): ComponentDetails {
  return {
    id: "addNext_" + (position + 1),
    value: {
      previousPosition: position,
      previousComponentType: previous,
      parentGroup: group
    },
    position: position + 1,
    type: ComponentType.ADD_NEXT,
    json: {},
    component: ComponentType.ADD_NEXT
  };
}

export function updatePositions(build: ComponentDetails[]) {
  build.forEach((item: ComponentDetails, index: number) => {
    item.position = index;
  });
}

export function deleteItem(itemToDelete: ComponentDetails, build: ComponentDetails[], parentGroup: ComponentType) {
  const index = build.findIndex(buildItem => buildItem.position === itemToDelete.position);
  build.splice(index, 1);
  const length = build.length;
  if (itemToDelete.position === 0) {
    build.unshift(genNextOptions(0, parentGroup, parentGroup));
  }
  if (index < length - 1 && build[index].type === ComponentType.ADD_NEXT) {
    build[index] = genNextOptions(index - 1, build[index - 1].type, parentGroup);
  }
  if (build[length - 1].type !== ComponentType.ADD_NEXT) {
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
  if (previousComponent.previousPosition !== build.length - 1 && build[previousComponent.previousPosition + 1].type === ComponentType.ADD_NEXT) {
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

export function addItem(itemToAdd: { selectedType: ComponentType; position: number; value: any }, build: ComponentDetails[], parentGroup: ComponentType) {
  const newComponent = generateNewComponent(itemToAdd.selectedType, itemToAdd.position, itemToAdd.value);
  if (!newComponent) return;
  build[itemToAdd.position] = newComponent;
  if (build[build.length - 1].type !== ComponentType.ADD_NEXT) {
    build.push(genNextOptions(build.length - 1, build[build.length - 1].type, parentGroup));
  }
  updatePositions(build);
}
