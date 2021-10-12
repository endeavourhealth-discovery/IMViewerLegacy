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

function getReturnString(value: string, counterEqTotalKeysMO: boolean) {
  return counterEqTotalKeysMO ? value : value + ",\n";
}

function handleIsArrayHasLength(newString: string, value: any, key: string) {
  if (isObjectHasKeys(value[0], ["name"])) {
    newString = value.map((item: any) => item.name).join(",\n\t");
  } else if (isObjectHasKeys(value[0], ["property", "name"])) {
    newString = value.map((item: any) => item.property.name).join(",\n\t");
  } else if (value.every((item: any) => typeof item === "string")) {
    newString = value.join(",\n\t ");
  } else {
    LoggerService.warn(undefined, "Uncovered object property or missing name found for key: " + key + " at conceptObjectToCopyString within helpers");
  }
  return newString;
}

export function conceptObjectToCopyString(
  key: string,
  value: any,
  counter: number,
  totalKeys: number,
  configs?: DefinitionConfig[]
): { label: string; value: string } | undefined {
  if ((Array.isArray(value) && !value.length) || (isObject(value) && !isObjectHasKeys(value))) {
    return;
  }
  let newString = "";
  let returnString = "";
  let newKey = key;
  const counterEqTotalKeysMO = counter === totalKeys - 1;

  if (configs && isArrayHasLength(configs)) {
    const label = configs.find((config: DefinitionConfig) => config.predicate === key);
    if (label) {
      newKey = label.label;
    }
  }

  if (isArrayHasLength(value)) {
    newString = handleIsArrayHasLength(newString, value, key);
    if (newString) {
      returnString = newKey + ": [\n\t" + newString + "\n]";
    }
  } else if (isObjectHasKeys(value, ["name"])) {
    newString = value.name;
    if (newString) {
      returnString = newKey + ": " + newString;
    }
  } else if (isObjectHasKeys(value, ["entity", "predicates"])) {
    returnString = newKey + ': "\n' + bundleToText(value) + '\n"';
  } else if (typeof value === "string") {
    newString = value.replace(/\n/g, "\n\t").replace(/<p>/g, "\n\t");
    if (newString) {
      returnString = newKey + ": " + newString;
    }
  } else if (typeof value === "number") {
    returnString = newKey + ": " + value.toString();
  } else {
    console.log(`CopyConceptToClipboard encountered unexpected object type. Object ${value} converted to json string`);
    returnString = newKey + ": " + JSON.stringify(value);
  }

  returnString = getReturnString(returnString, counterEqTotalKeysMO);

  return { label: newKey, value: returnString };
}
