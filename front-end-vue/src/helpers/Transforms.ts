import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";
import { TTBundle, TTIriRef } from "@/models/TripleTree";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";

export function bundleToText(bundle: TTBundle): string {
  let predicates = bundle.predicates;
  predicates = getDefaultPredicates(predicates);
  delete bundle.entity["@id"];
  let result = "";
  result += ttValueToString(bundle.entity, "object", 0, predicates);
  return result;
}

function getDefaultPredicates(predicates?: any) {
  if (!isObjectHasKeys(predicates)) predicates = {} as any;
  predicates[IM.IS_A] = "Is a";
  predicates[OWL.EQUIVALENT_CLASS] = "Is equivalent to";
  predicates[OWL.INTERSECTION_OF] = "Combination of";
  predicates[OWL.SOME_VALUES_FROM] = "With a value";
  predicates[OWL.ON_PROPERTY] = "On property";
  predicates[IM.ROLE_GROUP] = "Where";
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
  if (iri.name) result += iri.name.replace(/ *\([^)]*\) */g, "");
  else result += iri["@id"];
  if (previous === "array") result += "\n";
  return result;
}

export function ttNodeToString(node: any, previousType: string, indent: number, iriMap?: any): string {
  if (!iriMap) iriMap = getDefaultPredicates();
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
        suffix = ")\n";
      }
    }
    if (isObjectHasKeys(value, ["@id"])) {
      if (iriMap[key]) {
        result += pad + prefix + iriMap[key].replace(/ *\([^)]*\) */g, "") + " : ";
        result += ttIriToString(value as TTIriRef, "object", indent, true);
        result += suffix;
      } else {
        result += ttIriToString(value as TTIriRef, "object", indent, false);
      }
    } else {
      if (iriMap[key]) result += pad + prefix + iriMap[key].replace(/ *\([^)]*\) */g, "") + ":\n";
      if (previousType === "array") {
        if (group) {
          result += ttValueToString(value, "object", indent + 1, iriMap);
        } else {
          result += ttValueToString(value, "object", indent, iriMap);
        }
      }
      if (previousType === "object") {
        result += ttValueToString(value, "object", indent, iriMap);
      }
    }
    count++;
  }
  return result;
}

export function ttArrayToString(arr: any[], indent: number, iriMap?: any): string {
  if (!iriMap) iriMap = getDefaultPredicates();
  let result = "";
  for (const item of arr) {
    result += ttValueToString(item, "array", indent + 1, iriMap);
  }
  return result;
}
