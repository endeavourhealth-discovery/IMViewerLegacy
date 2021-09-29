import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import { ObjectMapTypeEnum } from "@/models/mapping/ObjectMapTypeEnum";
import { RMLMapping } from "@/models/mapping/RMLMapping";
import { SubjectMapTypeEnum } from "@/models/mapping/SubjectMapTypeEnum";
import { JSONPath } from "jsonpath-plus";

export async function isNested(file: any) {
  const json = JSON.parse(await (file as Blob).text());
  let isNested = false;
  if (Array.isArray(json)) {
    let index = 0;
    let found = false;
    while (json.length > index && !found) {
      if (fieldContainsObject(json[index])) {
        found = true;
        isNested = true;
      }
      index++;
    }
    console.log(index);
  } else {
    isNested = fieldContainsObject(json);
  }
  return isNested.toString();
}

function fieldContainsObject(json: any) {
  return Object.keys(json).some(function(key: any) {
    return json[key] && typeof json[key] === "object";
  });
}

export async function getTreeNodesFromJson(file: any) {
  const json = JSON.parse(await (file as Blob).text());
  const nodes = [] as any[];
  const nodeSet = new Set<string>();
  const index = 0;
  const node = {
    key: index,
    label: "$",
    data: "$",
    children: []
  };
  addTreeNode(index, nodeSet, nodes, json, node);
  nodes.push(node);
  return nodes;
}

function addTreeNode(index: number, nodeSet: Set<string>, nodes: any[], json: any, parent: any) {
  if (Object.keys(json) && typeof json === "object") {
    for (const field in json as any) {
      const labelData = parent ? (isNaN(field as any) ? parent.label + "." + field : parent.label + "[*]") : field;
      const node = {
        key: parent ? parent.key + "_" + index : index,
        label: labelData,
        data: labelData,
        children: []
      };
      if (!nodeSet.has(labelData)) {
        parent.children.push(node);
      }
      nodeSet.add(labelData);
      index++;
      addTreeNode(index, nodeSet, nodes, json[field], node);
    }
  }
}

export function getNodeValueByKey(nodes: any[], iterator: string) {
  if (!iterator) {
    return "$";
  }
  const results = [] as any[];
  const key = Object.keys(iterator)[0];
  nodes.forEach(node => {
    searchForValueByKey(node, key, results);
  });
  return results[0];
}

function searchForValueByKey(node: any, key: string, results: any[]) {
  if (node.key === key) {
    results.push(node.data);
  } else if (node.children) {
    node.children.forEach((child: any) => {
      searchForValueByKey(child, key, results);
    });
  }
  return;
}

export async function getValueSuggestions(file: any, iterator: string) {
  const json = JSON.parse(await (file as Blob).text());
  const result = JSONPath({ path: iterator, json });
  const suggestionSet = new Set<string>();
  addSuggestion(suggestionSet, result, null);
  return suggestionSet;
}

function addSuggestion(suggestionSet: Set<string>, json: any, parent: any) {
  if (Object.keys(json) && typeof json === "object") {
    for (const field in json as any) {
      const suggestion = parent ? (isNaN(field as any) ? parent + "." + field : parent + "[*]") : isNaN(field as any) ? field : "";
      suggestionSet.add(suggestion);
      addSuggestion(suggestionSet, json[field], suggestion);
    }
  }
}

export function buildMapDocumentString(formObject: MappingFormObject, mappings: RMLMapping[]): string {
  let mapDocumentString = `
@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix rml: <http://semweb.mmlab.be/ns/rml#> .
@prefix ql: <http://semweb.mmlab.be/ns/ql#> .
@prefix im: <http://endhealth.info/im#> .
@prefix fno: <https://w3id.org/function/ontology#> .
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#> .
@prefix shacl: <http://www.w3.org/ns/shacl#> .
@prefix rs: <http://prsb.info/rs#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://endhealth.info/mapping/prsb.ttl#> .
`;
  mapDocumentString += getRmlMaps(formObject, mappings);
  return mapDocumentString;
}

function getRmlMaps(formObject: MappingFormObject, mappings: RMLMapping[]) {
  let returnValue = "";
  mappings.forEach(mapping => {
    returnValue += getSubjectMap(formObject, mapping);
    returnValue += getObjectMaps(mapping);
  });
  return returnValue;
}

function getSubjectMap(formObject: MappingFormObject, mapping: RMLMapping) {
  let subjectMap = `
<#${mapping.name}> a rr:TriplesMap;
  rml:logicalSource [
    rml:source "${formObject.contentFileName}";
    rml:referenceFormulation ${getReferenceFormulation(formObject.contentFileType)};`;
  subjectMap += mapping.iterator
    ? `
    rml:iterator "${mapping.iterator}"
  ];`
    : `
  ];
  `;
  subjectMap += `
  rr:subjectMap [
   `;
  subjectMap += getPredicateObjectMap(mapping.subjectMapType, mapping.subjectMapValue);
  subjectMap += `; 
    rr:class ${mapping.class}
  ];
  `;

  return subjectMap;
}

function getReferenceFormulation(fileType: string) {
  switch (fileType) {
    case "text/csv":
      return "ql:CSV";
    case "application/json":
      return "ql:JSONPath";
  }
}

function getObjectMaps(mapping: RMLMapping) {
  let objectMaps = "";
  mapping.objectMaps.forEach(predicate => {
    objectMaps += `
  rr:predicateObjectMap [
    rr:predicate ${predicate.property};
    rr:objectMap [`;

    objectMaps += getPredicateObjectMap(predicate.type, predicate.value);
    objectMaps += ` ]
  ];`;
  });
  return objectMaps.slice(0, -1) + ".";
}

function getPredicateObjectMap(type: ObjectMapTypeEnum | SubjectMapTypeEnum, value: string) {
  switch (type) {
    case ObjectMapTypeEnum.functionValue:
      return ` 
      rr:predicateObjectMap [
        rr:predicate fno:executes ;
        rr:objectMap [ rr:constant im:${value} ] 
      ];
    ];`;
    case ObjectMapTypeEnum.parentTriplesMap:
      return ` ${type} <#${value}>`;
    default:
      return ` ${type} "${value}"`;
  }
}
