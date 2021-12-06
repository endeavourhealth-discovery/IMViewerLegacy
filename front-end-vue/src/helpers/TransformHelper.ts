import TransformMappingObject from "@/models/transform/TransformMappingObject";
import { isArrayHasLength, isObject, isObjectHasKeys } from "./DataTypeCheckers";

export function transform(dataModel: any, input: any, instruction: TransformMappingObject): string {
  if (!instruction.transformValue) {
    return "";
  }
  switch (instruction.transformType) {
    case "function":
      return getValueFromFunctions(dataModel, input, instruction);
    case "template":
      return getValueFromTemplate(input, instruction);
    case "reference":
      return input[0][instruction.transformValue as string];
    case "constant":
      return instruction.transformValue as string;
    default:
      return instruction.transformValue as string;
  }
}

export function getPathMap(instances: any[]): Map<string, string> {
  const pathMap = new Map<string, string>();
  const paths: string[] = rKeys(instances)
    .toString()
    .split(",");

  paths.forEach(path => {
    const parts = path.split(".");
    parts[0] = instances[+parts[0]]["rdf:type"];
    pathMap.set(parts.join("."), path);
  });

  return pathMap;
}

function rKeys(o: any, path = ""): any {
  if (!o || typeof o !== "object") return path;
  return Object.keys(o).map(key => rKeys(o[key], path ? [path, key].join(".") : key));
}

function getValueFromFunctions(dataModel: any, input: any, instruction: TransformMappingObject): string {
  const value = input[0][instruction.property as string];
  const transformations: string[] = [];
  transformations.push(value);
  let index = 0;
  if (isArrayHasLength(instruction.transformValue)) {
    (instruction.transformValue as []).forEach(transformValue => {
      transformations.push(getValueFromFunction(dataModel, transformations[index], transformValue));
      index++;
    });
    return transformations[transformations.length - 1];
  }

  return getValueFromFunction(dataModel, value, instruction.transformValue as string);
}

function getValueFromFunction(dataModel: any, value: string, transformValue: string): string {
  switch (transformValue) {
    case "generateIri":
      return generateIri(dataModel, value);
    case "toUpperCase":
      return value.toUpperCase();
    case "toLowerCase":
      return value.toLowerCase();
    case "removeSpaces":
      return value.replaceAll(" ", "");
    case "toLowerCamelCase":
      return toLowerCamelCase(value);
    case "toUpperCamelCase":
      return toUpperCamelCase(value);

    default:
      return value;
  }
}

function toUpperCamelCase(value: string): string {
  const lowerCamelCase = toLowerCamelCase(value);
  return lowerCamelCase.charAt(0).toUpperCase() + lowerCamelCase.slice(1);
}

function toLowerCamelCase(value: string): string {
  return value.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function generateIri(dataModel: any, value: string): string {
  const shortcut = dataModel["@graph"]["@id"].split(":");
  const firstPart = dataModel["@context"][shortcut[0]];
  return firstPart + value;
}

function getValueFromTemplate(input: any, instruction: TransformMappingObject): string {
  const openingIndex = instruction.transformValue.indexOf("{");
  const closingIndex = instruction.transformValue.indexOf("}");
  const enclosedString = (instruction.transformValue as string).substring(openingIndex, closingIndex + 1);
  const value = input[0][enclosedString.substring(1, enclosedString.length - 1)];
  return (instruction.transformValue as string).replace(new RegExp(enclosedString), value);
}
