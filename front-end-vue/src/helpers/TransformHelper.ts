import TransformMappingObject from "@/models/transform/TransformMappingObject";
import { isArrayHasLength, isObject, isObjectHasKeys } from "./DataTypeCheckers";

export function transform(value: string, instruction: TransformMappingObject) {
  if (instruction.transformType === "function" && instruction.transformValue === "toUpperCase") {
    return value.toUpperCase();
  }

  return value.toLowerCase();
}

export function getDataModelInstances(ttdocument: any): any[] {
  const instances = [] as any[];
  ttdocument.entities.forEach((entity: any) => {
    const instance = {
      "@id": null,
      "rdf:type": entity["rdfs:label"],
      "rdfs:label": null
    };
    if (isObjectHasKeys(entity, ["sh:property"])) {
      entity["sh:property"].forEach((property: any) => {
        const propertyName: string = property["sh:path"]?.name || property["sh:path"]["@id"];
        const value = "sh:node" in property ? { "@id": null } : null;
        (instance as any)[propertyName] = value;
      });
    }
    instances.push(instance);
  });
  return instances;
}

export function getPathOptions(instances: any[]): Map<string, string> {
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
