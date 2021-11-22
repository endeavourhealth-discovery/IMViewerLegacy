import { TTBundle, TTIriRef } from "@/models/TripleTree";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";

export function bundleToText(bundle: TTBundle, defaultPredicatenames: any, indent: number): string {
  let predicates = bundle.predicates;
  predicates = addDefaultPredicates(predicates, defaultPredicatenames);
  delete bundle.entity["@id"];
  let result = "";
  result += ttValueToString(bundle.entity, "object", indent, predicates);
  return result;
}

function addDefaultPredicates(predicates?: any, defaults?: any) {
  if (!isObjectHasKeys(predicates)) predicates = {} as any;
  if (!isObjectHasKeys(defaults)) return predicates;
  for (const [key, value] of Object.entries(defaults)) {
    predicates[key] = value;
  }
  return predicates;
}

export function ttValueToString(node: any, previousType: string, indent: number, iriMap?: any): string {
  if (isObjectHasKeys(node, ["@id"])) {
    return ttIriToString(node, previousType, indent, false);
  } else if (isObjectHasKeys(node)) {
    return ttNodeToString(node, previousType, indent, iriMap);
  } else if (isArrayHasLength(node)) {
    return ttArrayToString(node, indent, iriMap);
  } else {
    return "";
  }
}

export function ttIriToString(iri: TTIriRef, previous: string, indent: number, inline: boolean): string {
  const pad = "  ".repeat(indent);
  let result = "";
  if (!inline) result += pad;
  if (iri.name) result += removeEndBrackets(iri.name);
  else result += iri["@id"];
  if (previous === "array") result += "\n";
  return result;
}

export function ttNodeToString(node: any, previousType: string, indent: number, iriMap?: any): string {
  const pad = "  ".repeat(indent);
  let result = "";
  let first = true;
  let last = false;
  const totalKeys = Object.keys(node).length;
  let count = 1;
  let group = false;
  if (totalKeys > 1) group = true;
  for (const [key, value] of Object.entries(node)) {
    if (totalKeys === count) last = true;
    if (count === 1) first = true;
    let prefix = "";
    let suffix = "\n";

    if (group) {
      prefix = "  ";
      if (first) {
        prefix = "( ";
        first = false;
      }
      if (last) {
        suffix = " )\n";
      }
    }
    result = processNode(key, value, result, previousType, indent, iriMap, { pad: pad, prefix: prefix, suffix: suffix, group: group });
    count++;
  }
  return result;
}

function processNode(key: string, value: any, result: string, previousType: string, indent: number, iriMap: any, stringAdditions: any): string {
  const pad = stringAdditions.pad;
  const prefix = stringAdditions.prefix;
  const suffix = stringAdditions.suffix;
  if (isObjectHasKeys(value, ["@id"])) {
    result += getObjectName(key, iriMap, pad, prefix);
    result += ttIriToString(value as TTIriRef, "object", indent, true);
    result += suffix;
  } else if (isArrayHasLength(value) && value.length === 1) {
    if (isObjectHasKeys(value[0], ["@id"])) {
      result += getObjectName(key, iriMap, pad, prefix);
      result += ttIriToString(value[0] as TTIriRef, "object", indent, true);
      result += suffix;
    } else {
      result += processObject(key, value, result, previousType, indent, iriMap, stringAdditions);
    }
  } else {
    result += processObject(key, value, result, previousType, indent, iriMap, stringAdditions);
  }
  return result;
}

function getObjectName(key: string, iriMap: any, pad: string, prefix: string) {
  if (iriMap && iriMap[key]) return pad + prefix + removeEndBrackets(iriMap[key]) + " : ";
  else return pad + prefix + removeEndBrackets(key) + " : ";
}

function processObject(key: string, value: any, result: string, previousType: string, indent: number, iriMap: any, stringAdditions: any): string {
  const pad = stringAdditions.pad;
  const prefix = stringAdditions.prefix;
  const group = stringAdditions.group;
  if (iriMap[key]) result += pad + prefix + removeEndBrackets(iriMap[key]) + ":\n";
  else result += pad + prefix + key + ":\n";
  if (previousType === "array") {
    if (group) {
      result += ttValueToString(value, "object", indent + 1, iriMap);
    } else {
      result += ttValueToString(value, "object", indent, iriMap);
    }
  }
  if (previousType === "object") {
    if (isArrayHasLength(value)) {
      result += ttValueToString(value, "object", indent, iriMap);
    } else {
      result += ttValueToString(value, "object", indent + 1, iriMap);
    }
  }
  return result;
}

export function ttArrayToString(arr: any[], indent: number, iriMap?: any): string {
  let result = "";
  for (const item of arr) {
    result += ttValueToString(item, "array", indent + 1, iriMap);
  }
  return result;
}

function removeEndBrackets(str: string): string {
  const lastBracketStart = str.lastIndexOf("(");
  const bracketText = str.substring(lastBracketStart);
  const lastBracketEnd = bracketText.indexOf(")");
  if (lastBracketStart > 0 && lastBracketEnd > 0) return str.substring(0, lastBracketStart).trimEnd() + str.substring(lastBracketEnd + lastBracketStart + 1);
  else return str;
}
