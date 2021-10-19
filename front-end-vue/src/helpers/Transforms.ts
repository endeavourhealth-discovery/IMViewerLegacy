import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";
import { TTBundle, TTIriRef } from "@/models/TripleTree";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";

export function bundleToText(bundle: TTBundle): string {
  console.log(bundle);
  // Add custom id -> name maps
  bundle.predicates[IM.IS_A] = "Is a";
  bundle.predicates[OWL.EQUIVALENT_CLASS] = "Is equivalent to";
  bundle.predicates[OWL.INTERSECTION_OF] = "Combination of";
  bundle.predicates[OWL.SOME_VALUES_FROM] = "With a value";
  bundle.predicates[OWL.ON_PROPERTY] = "On property";
  bundle.predicates[IM.ROLE_GROUP] = "Where";

  delete bundle.entity["@id"];

  let result = "";

  result += ttValueToString(bundle.entity, "object", "", bundle.predicates, 0);
  return result;
}

export function ttValueToString(node: any, previousType: string, previousKey: string, iriMap: any, indent: number): string {
  if (isObjectHasKeys(node, ["@id"])) {
    return ttIriToString(node, previousType, indent, false);
  } else if (isObjectHasKeys(node)) {
    return ttNodeToString(node, previousType, previousKey, indent, iriMap);
  } else if (isArrayHasLength(node)) {
    return ttArrayToString(node, previousType, previousKey, indent, iriMap);
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

export function ttNodeToString(node: any, previousType: string, previousKey: string, indent: number, iriMap: any): string {
  const pad = "  ".repeat(indent);
  let result = "";
  let first = true;
  let last = false;
  const totalKeys = Object.keys(node).length;
  let count = 1;
  let group = false;
  if (previousKey === IM.ROLE_GROUP || previousKey === OWL.INTERSECTION_OF || previousKey === OWL.SOME_VALUES_FROM) group = true;
  for (const [key, value] of Object.entries(node)) {
    if (totalKeys === count) last = true;
    if (count === 1) first = true;
    if (first && group && !last) {
      if (isObjectHasKeys(value, ["@id"])) {
        if (iriMap[key]) {
          result += pad + "( " + iriMap[key].replace(/ *\([^)]*\) */g, "") + " : ";
          result += ttIriToString(value as TTIriRef, "object", indent, true);
          result += "\n";
        } else {
          result += ttIriToString(value as TTIriRef, "object", indent, false);
        }
      } else {
        if (iriMap[key]) result += pad + "( " + iriMap[key].replace(/ *\([^)]*\) */g, "") + ":\n";
        if (previousType === "array") {
          result += ttValueToString(value, "object", key, iriMap, indent + 1);
        }
        if (previousType === "object") {
          result += ttValueToString(value, "object", key, iriMap, indent);
        }
      }
      first = false;
    } else if (last && group) {
      if (isObjectHasKeys(value, ["@id"])) {
        if (iriMap[key]) {
          result += pad + "  " + iriMap[key].replace(/ *\([^)]*\) */g, "") + " : ";
          result += ttIriToString(value as TTIriRef, "object", indent, true);
          result += " )\n";
        } else {
          result += ttIriToString(value as TTIriRef, "object", indent, false);
        }
      } else {
        if (iriMap[key]) result += pad + "  " + iriMap[key].replace(/ *\([^)]*\) */g, "") + ":\n";
        if (previousType === "array") {
          result += ttValueToString(value, "object", key, iriMap, indent + 1);
        }
        if (previousType === "object") {
          result += ttValueToString(value, "object", key, iriMap, indent);
        }
      }
    } else if (group) {
      if (isObjectHasKeys(value, ["@id"])) {
        if (iriMap[key]) {
          result += pad + "  " + iriMap[key].replace(/ *\([^)]*\) */g, "") + " : ";
          result += ttIriToString(value as TTIriRef, "object", indent, true);
          result += "\n";
        } else {
          result += ttIriToString(value as TTIriRef, "object", indent, false);
        }
      } else {
        if (iriMap[key]) result += pad + "  " + iriMap[key].replace(/ *\([^)]*\) */g, "") + ":\n";
        if (previousType === "array") {
          result += ttValueToString(value, "object", key, iriMap, indent + 1);
        }
        if (previousType === "object") {
          result += ttValueToString(value, "object", key, iriMap, indent);
        }
      }
    } else {
      if (isObjectHasKeys(value, ["@id"])) {
        if (iriMap[key]) {
          result += pad + iriMap[key].replace(/ *\([^)]*\) */g, "") + " : ";
          result += ttIriToString(value as TTIriRef, "object", indent, true);
          result += "\n";
        } else {
          result += ttIriToString(value as TTIriRef, "object", indent, false);
        }
      } else {
        if (iriMap[key]) result += pad + iriMap[key].replace(/ *\([^)]*\) */g, "") + ":\n";
        if (previousType === "array") {
          result += ttValueToString(value, "object", key, iriMap, indent + 1);
        }
        if (previousType === "object") {
          result += ttValueToString(value, "object", key, iriMap, indent);
        }
      }
    }
    count++;
  }
  return result;
}

export function ttArrayToString(arr: any[], previousType: string, previousKey: string, indent: number, iriMap: any): string {
  let result = "";
  for (const [index, item] of arr.entries()) {
    result += ttValueToString(item, "array", previousKey, iriMap, indent + 1);
  }
  return result;
}
