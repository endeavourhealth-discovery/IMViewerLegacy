import { PartialBundle } from "@/models/entityServiceTypes/EntityServiceTypes";
import TTGraphData from "@/models/TTGraphData";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { SHACL } from "@/vocabulary/SHACL";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";

const excludedPredicates = [IM.MATCHED_TO, IM.HAS_STATUS, IM.STATUS, RDFS.COMMENT, RDF.TYPE, RDFS.LABEL];

export function translateFromEntityBundle(bundle: PartialBundle): TTGraphData {
  const { entity, predicates } = bundle;
  const firstNode = { name: entity[RDFS.LABEL], iri: entity["@id"], relToParent: "", children: [], _children: [] } as TTGraphData;
  const keys = Object.keys(entity).filter(key => key != "@id" && !excludedPredicates.includes(key));
  addNodes(entity, keys, firstNode, predicates);
  return firstNode;
}

function getPropertyIri(nested: any): string {
  if (isObjectHasKeys(nested, [SHACL.CLASS])) {
    return nested[SHACL.CLASS]["@id"];
  }
  if (isObjectHasKeys(nested, [SHACL.DATATYPE])) {
    return nested[SHACL.DATATYPE]["@id"];
  }

  return "undefined";
}

function getPropertyName(nested: any): string {
  if (isObjectHasKeys(nested, [SHACL.CLASS])) {
    return nested[SHACL.CLASS].name || getNameFromIri(nested[SHACL.CLASS]["@id"]);
  }

  if (isObjectHasKeys(nested, [SHACL.DATATYPE])) {
    return nested[SHACL.DATATYPE].name || getNameFromIri(nested[SHACL.DATATYPE]["@id"]);
  }

  return "undefined";
}

function getNameFromIri(iri: string): string {
  // http://www.w3.org/2001/XMLSchema#
  if (!iri) return iri;
  if (iri.startsWith("http://www.w3.org/2001/XMLSchema#") || iri.startsWith("http://snomed.info/sct#")) return iri.split("#")[1];
  if (iri.startsWith("http://endhealth.info/im#im:")) return iri.substring("http://endhealth.info/im#im:".length);
  if (iri.startsWith("http://endhealth.info/im#")) return iri.substring("http://endhealth.info/im#".length);
  return "undefined";
}

function addNodes(entity: any, keys: string[], firstNode: TTGraphData, predicates: any): void {
  if (isObjectHasKeys(entity)) {
    keys.forEach(key => {
      if (isArrayHasLength(entity[key]) && key === SHACL.PROPERTY) {
        entity[key].forEach((nested: any) => {
          firstNode.children.push({
            name: getPropertyName(nested),
            iri: getPropertyIri(nested),
            relToParent: nested[SHACL.PATH].name,
            children: [],
            _children: []
          });
        });
      } else if (isArrayHasLength(entity[key])) {
        entity[key].forEach((nested: any) => {
          if (isObjectHasKeys(nested)) {
            firstNode.children.push({ name: nested.name, iri: nested["@id"], relToParent: predicates[key], children: [], _children: [] });
          } else {
            firstNode.children.push({ name: nested, iri: "", relToParent: getNameFromIri(key), children: [], _children: [] });
          }
        });
      } else if (isObjectHasKeys(entity[key])) {
        firstNode.children.push({ name: entity[key].name, iri: entity[key]["@id"], relToParent: predicates[key], children: [], _children: [] });
      } else {
        firstNode.children.push({ name: entity[key], iri: entity[key]["@id"], relToParent: predicates[key], children: [], _children: [] });
      }
    });
  }
}

export function translateFromTTDocument(ttdocument: any): TTGraphData {
  const firstNode = {
    name: ttdocument.entities[0]["rdfs:label"],
    iri: ttdocument.entities[0]["@id"],
    relToParent: "",
    children: [],
    _children: []
  } as TTGraphData;
  const predicateSet = new Set<string>();
  ttdocument.entities.forEach((entity: any) => {
    const keys = Object.keys(entity);
    addAllPredicates(entity, keys, predicateSet, ttdocument);
  });
  addAllNodes(firstNode, ttdocument.entities[0], predicateSet, ttdocument);
  return firstNode;
}

function addAllNodes(node: TTGraphData, entity: any, predicateSet: Set<string>, ttdocument: any) {
  if (isObjectHasKeys(entity)) {
    for (const key in entity) {
      if (key === "sh:property") {
        entity[key].forEach((property: any) => {
          if (!Object.keys(property).includes("sh:node")) {
            node.children.push({
              name: property["sh:path"].name,
              iri: property["sh:path"]["@id"],
              relToParent: property["sh:path"]["@id"],
              children: [],
              _children: []
            });
          } else {
            const nodeEntity = findEntityByIri(ttdocument.entities as [], property["sh:node"]["@id"]) as any;
            const child = {
              name: nodeEntity["rdfs:label"],
              iri: nodeEntity["@id"],
              relToParent: property["sh:path"].name || property["sh:path"]["@id"],
              children: [],
              _children: []
            } as TTGraphData;
            addAllNodes(child, nodeEntity, predicateSet, ttdocument);
            node.children.push(child);
          }
        });
      }
    }
  }
}

export function hasNodeChildrenByName(data: TTGraphData, name: string): boolean {
  const nodes = [] as TTGraphData[];
  findNodeByName(data, name, nodes);

  if (isArrayHasLength(nodes) && (isArrayHasLength(nodes[0].children) || isArrayHasLength(nodes[0]._children))) {
    return true;
  }
  return false;
}

function findNodeByName(data: TTGraphData, name: string, nodes: TTGraphData[]): void {
  if (data.name === name) {
    nodes.push(data);
  } else if (isArrayHasLength(data.children)) {
    data.children.forEach(child => {
      findNodeByName(child, name, nodes);
    });
  }
}

export function closeNodeByName(data: TTGraphData, name: string): void {
  if (data.name === name) {
    if (isArrayHasLength(data.children)) {
      data._children = data.children;
      data.children = [];
    } else {
      data.children = data._children;
      data._children = [];
    }
  } else if (isArrayHasLength(data.children)) {
    data.children.forEach(child => {
      closeNodeByName(child, name);
    });
  }
}

function findEntityByIri(entities: [], iri: string) {
  let entity = {};
  let i = 0;
  let found = false;
  while (!found && i < entities.length) {
    if (entities[i]["@id"] === iri) {
      entity = entities[i];
      found = true;
    }
    i++;
  }
  return entity;
}

function addAllPredicates(entity: any, keys: string[], predicateSet: Set<string>, ttdocument: any) {
  if (isObjectHasKeys(entity)) {
    keys.forEach(key => {
      const fullKey = getFullKeyIri(key, ttdocument);
      if (fullKey != "@id" && !excludedPredicates.includes(fullKey)) {
        predicateSet.add(fullKey);
      }
      if (isArrayHasLength(entity[key])) {
        entity[key].forEach((nestedEntity: any) => {
          addAllPredicates(nestedEntity, keys, predicateSet, ttdocument);
        });
      }
      if (isObjectHasKeys(entity[key])) {
        addAllPredicates(entity[key], keys, predicateSet, ttdocument);
      }
    });
  }
}

function getFullKeyIri(shortcutKey: string, ttdocument: any) {
  if (!shortcutKey.includes(":")) {
    return shortcutKey;
  }
  const parts = shortcutKey.split(":");
  return ttdocument["@context"][parts[0]] + parts[1];
}
