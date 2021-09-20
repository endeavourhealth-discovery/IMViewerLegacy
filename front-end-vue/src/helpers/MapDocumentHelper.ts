import { MappingFormObject } from "@/models/mapping/MappingFormObject";
import { ObjectMapTypeEnum } from "@/models/mapping/ObjectMapTypeEnum";
import { RMLMapping } from "@/models/mapping/RMLMapping";
import { SubjectMapTypeEnum } from "@/models/mapping/SubjectMapTypeEnum";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";

export async function getTreeNodesFromJson(file: any) {
  const json = JSON.parse(await (file as Blob).text());
  const nodes = [] as any[];
  const nodeSet = new Set<string>();
  const index = 0;

  addTreeNode(index, nodes, json, null);

  return nodes;
}

function addTreeNode(index: number, nodes: any[], json: any, parent: any) {
  if (Object.keys(json) && (typeof json === "object")) {
    for (const field in json as any) {
      const node = {
        key: parent ? parent.key + "_" + index : index,
        label: parent ? (isNaN(field as any) ? parent.label + "." + field : parent.label + "[" + field + "]") : field,
        data: field,
        children: []
      };
      if (parent) {
        parent.children.push(node);
      } else {
        nodes.push(node);
      }
      index++;
      addTreeNode(index, nodes, json[field], node);
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
  })
  return returnValue;
}

function getSubjectMap(formObject: MappingFormObject, mapping: RMLMapping) {
  let subjectMap = `
<#${mapping.name}> a rr:TriplesMap;
  rml:logicalSource [
    rml:source "${formObject.contentFileName}";
    rml:referenceFormulation ${getReferenceFormulation(formObject.contentFileType)};`;
  subjectMap += mapping.iterator ? `
    rml:iterator "${mapping.iterator}"];]` : `
  ];
  `
  subjectMap += `
  rr:subjectMap [
   `
  subjectMap += getPredicateObjectMap(mapping.subjectMapType, mapping.subjectMapValue);
  subjectMap +=
    `; 
    rr:class ${mapping.class}
  ];
  `

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
  })
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
    ];`
    case ObjectMapTypeEnum.parentTriplesMap:
      return ` ${type} <#${value}>`
    default:
      return ` ${type} "${value}"`;
  }
}