import { DefinitionConfig } from "@/models/configs/DefinitionConfig";
import LoggerService from "@/services/LoggerService";
import { bundleToText } from "@/helpers/Transforms";
import { isArrayHasLength, isObject, isObjectHasKeys } from "./DataTypeCheckers";

export function copyConceptToClipboard(concept: any, configs?: DefinitionConfig[]): string {
  const totalKeys = Object.keys(concept).length;
  let counter = 0;
  let returnString = "";
  let key: string;
  let value: any;
  for ([key, value] of Object.entries(concept)) {
    const copyString = conceptObjectToCopyString(key, value, counter, totalKeys, configs);
    if (copyString) returnString += copyString.value;
    counter++;
  }
  if (returnString.endsWith(",\n")) {
    return returnString.slice(0, -2);
  }
  return returnString;
}

export function conceptObjectToCopyString(
  key: string,
  value: any,
  counter: number,
  totalKeys: number,
  configs?: DefinitionConfig[]
): { label: string; value: string } | undefined {
  let newString = "";
  let returnString = "";
  let newKey = key;
  if (configs && isArrayHasLength(configs)) {
    const label = configs.find((config: DefinitionConfig) => config.predicate === key);
    if (label) {
      newKey = label.label;
    }
  }
  if (isArrayHasLength(value)) {
    if (isObjectHasKeys(value[0], ["name"])) {
      newString = value.map((item: any) => item.name).join(",\n\t");
    } else if (isObjectHasKeys(value[0], ["property", "name"])) {
      newString = value.map((item: any) => item.property.name).join(",\n\t");
    } else if (value.every((item: any) => typeof item === "string")) {
      newString = value.join(",\n\t ");
    } else {
      LoggerService.warn(undefined, "Uncovered object property or missing name found for key: " + key + " at conceptObjectToCopyString within helpers");
    }
    if (newString) {
      if (counter === totalKeys - 1) {
        returnString = newKey + ": [\n\t" + newString + "\n]";
      } else {
        returnString = newKey + ": [\n\t" + newString + "\n],\n";
      }
    }
  } else if (Array.isArray(value) && !value.length) {
    return;
  } else if (isObject(value) && !isObjectHasKeys(value)) {
    return;
  } else if (isObjectHasKeys(value, ["name"])) {
    newString = value.name;
    if (newString) {
      if (counter === totalKeys - 1) {
        returnString = newKey + ": " + newString;
      } else {
        returnString = newKey + ": " + newString + ",\n";
      }
    }
  } else if (isObjectHasKeys(value, ["entity", "predicates"])) {
    if (counter === totalKeys - 1) {
      returnString = newKey + ': "\n' + bundleToText(value) + '\n"';
    } else {
      returnString = newKey + ': "\n' + bundleToText(value) + '\n",\n';
    }
  } else if (typeof value === "string") {
    newString = value.replace(/\n/g, "\n\t").replace(/<p>/g, "\n\t");
    if (newString) {
      if (counter === totalKeys - 1) {
        returnString = newKey + ": " + newString;
      } else {
        returnString = newKey + ": " + newString + ",\n";
      }
    }
  } else if (typeof value === "number") {
    if (counter === totalKeys - 1) {
      returnString = newKey + ": " + value.toString();
    } else {
      returnString = newKey + ": " + value.toString() + ",\n";
    }
  } else {
    console.log(`CopyConceptToClipboard encountered unexpected object type. Object ${value} converted to json string`);
    if (counter === totalKeys - 1) {
      returnString = newKey + ": " + JSON.stringify(value);
    } else {
      returnString = newKey + ": " + JSON.stringify(value) + ",\n";
    }
  }
  return { label: newKey, value: returnString };
}
