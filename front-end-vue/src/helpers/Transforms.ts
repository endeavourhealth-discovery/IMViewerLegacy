import { TTBundle, TTIriRef } from "@/models/TripleTree";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";
import ConfigService from "@/services/ConfigService";

export async function bundleToText(bundle: TTBundle): Promise<string> {
  let predicates = bundle.predicates;
  predicates = await getDefaultPredicates(predicates);
  delete bundle.entity["@id"];
  let result = "";
  result += await ttValueToString(bundle.entity, "object", 0, predicates);
  return result;
}

async function getDefaultPredicates(predicates?: any) {
  if (!isObjectHasKeys(predicates)) predicates = {} as any;
  const defaults = await ConfigService.getDefaultPredicatenames();
  for (const [key, value] of Object.entries(defaults)) {
    predicates[key] = value;
  }
  return predicates;
}

export async function ttValueToString(node: any, previousType: string, indent: number, iriMap?: any): Promise<string> {
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

export async function ttNodeToString(node: any, previousType: string, indent: number, iriMap?: any): Promise<string> {
  if (!iriMap) iriMap = await getDefaultPredicates();
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
    result = await processNode(key, value, result, previousType, indent, iriMap, { pad: pad, prefix: prefix, suffix: suffix, group: group });
    count++;
  }
  return result;
}

async function processNode(key: string, value: any, result: string, previousType: string, indent: number, iriMap: any, stringAdditions: any) {
  const pad = stringAdditions.pad;
  const prefix = stringAdditions.prefix;
  const suffix = stringAdditions.suffix;
  if (isObjectHasKeys(value, ["@id"])) {
    if (iriMap[key]) result += pad + prefix + removeEndBrackets(iriMap[key]) + " : ";
    else result += pad + prefix + removeEndBrackets(key) + " : ";
    result += ttIriToString(value as TTIriRef, "object", indent, true);
    result += suffix;
  } else {
    result += await processObject(key, value, result, previousType, indent, iriMap, stringAdditions);
  }
  return result;
}

async function processObject(
  key: string,
  value: any,
  result: string,
  previousType: string,
  indent: number,
  iriMap: any,
  stringAdditions: any
): Promise<string> {
  const pad = stringAdditions.pad;
  const prefix = stringAdditions.prefix;
  const group = stringAdditions.group;
  if (iriMap[key]) result += pad + prefix + removeEndBrackets(iriMap[key]) + ":\n";
  else result += pad + prefix + key + ":\n";
  if (previousType === "array") {
    if (group) {
      result += await ttValueToString(value, "object", indent + 1, iriMap);
    } else {
      result += await ttValueToString(value, "object", indent, iriMap);
    }
  }
  if (previousType === "object") {
    if (isArrayHasLength(value)) {
      result += await ttValueToString(value, "object", indent, iriMap);
    } else {
      result += await ttValueToString(value, "object", indent + 1, iriMap);
    }
  }
  return result;
}

export async function ttArrayToString(arr: any[], indent: number, iriMap?: any): Promise<string> {
  if (!iriMap) iriMap = await getDefaultPredicates();
  let result = "";
  for (const item of arr) {
    result += await ttValueToString(item, "array", indent + 1, iriMap);
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
