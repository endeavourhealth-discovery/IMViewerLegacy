import { IM } from "@/vocabulary/IM";
import { OWL } from "@/vocabulary/OWL";
import { TTBundle, TTIriRef } from "@/models/TripleTree";

export function bundleToText(bundle: TTBundle): string {
  // Add custom id -> name maps
  bundle.predicates[IM.IS_A] = "Is a";
  bundle.predicates[OWL.EQUIVALENT_CLASS] = "Is equivalent to";
  bundle.predicates[OWL.INTERSECTION_OF] = "Combination of";
  bundle.predicates[OWL.SOME_VALUES_FROM] = "With a value";
  bundle.predicates[OWL.ON_PROPERTY] = "On property";

  delete bundle.entity["@id"];

  let result = "";

  for (const p of Object.keys(bundle.entity)) {
    result += ttValueToString(bundle.predicates[p], bundle.entity[p], bundle.predicates, 0);
  }
  return result.replace(/ *\([^)]*\) */g, "");
}

export function ttValueToString(pred: string, node: any, iriMap: any, indent: number): string {
  const pad = "  ".repeat(indent);
  if (node["@id"]) {
    return ttIriToString(pred, node, indent) + "\n";
  } else if (node instanceof Array) {
    return ttArrayToString(pred, node, indent, iriMap);
  } else if (node instanceof Object) {
    return ttNodeToString(pred, node, indent, iriMap);
  } else {
    return pad + node;
  }
}

export function ttIriToString(pred: string, iri: TTIriRef, indent: number): string {
  return "  ".repeat(indent) + pred + " : (" + iri["name"] ? iri["name"] : iri["@id"] + ")\n";
}

export function ttNodeToString(pred: string, node: any, indent: number, iriMap: any): string {
  const pad = "  ".repeat(indent);
  let result = "";

  result += "\n";

  for (const p of Object.keys(node)) {
    result += pad + "  " + iriMap[p] + " : " + ttValueToString("", node[p], iriMap, indent + 1);
  }

  return result;
}

export function ttArrayToString(pred: string, arr: any[], indent: number, iriMap: any): string {
  const pad = "  ".repeat(indent);
  let result = "";

  result += pad + pred + "\n";

  for (const item of arr) {
    result += pad + "  " + ttValueToString(pred, item, iriMap, indent + 1);
  }

  result += pad + "\n";

  return result;
}
