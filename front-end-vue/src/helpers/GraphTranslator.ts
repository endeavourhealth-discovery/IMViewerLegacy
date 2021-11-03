import { PartialBundle } from "@/models/entityServiceTypes/EntityServiceTypes";
import TTGraphData from "@/models/TTGraphData";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { SHACL } from "@/vocabulary/SHACL";
import { isArrayHasLength, isObjectHasKeys } from "./DataTypeCheckers";

export function translateFromEntityBundle(bundle: PartialBundle) {
  const { entity, predicates } = bundle;
  const firstNode = { name: entity[RDFS.LABEL], relToParent: "", children: [], _children: [] } as TTGraphData;
  const excludedPredicates = [IM.MATCHED_TO, IM.HAS_STATUS, IM.STATUS, RDFS.COMMENT, RDF.TYPE, RDFS.LABEL];
  const keys = Object.keys(entity).filter(key => key != "@id" && !excludedPredicates.includes(key));
  addNodes(entity, keys, firstNode, predicates);
  return firstNode;
}

function addNodes(entity: any, keys: string[], firstNode: TTGraphData, predicates: any) {
  if (isObjectHasKeys(entity)) {
    keys.forEach(key => {
      if (isArrayHasLength(entity[key]) && key === SHACL.PROPERTY) {
        entity[key].forEach((nested: any) => {
          firstNode.children.push({ name: nested[SHACL.CLASS].name, relToParent: nested[SHACL.PATH].name, children: [], _children: [] });
        });
      } else if (isArrayHasLength(entity[key])) {
        entity[key].forEach((nested: any) => {
          firstNode.children.push({ name: nested.name, relToParent: predicates[key], children: [], _children: [] });
        });
      } else if (isObjectHasKeys(entity[key])) {
        firstNode.children.push({ name: entity[key].name, relToParent: predicates[key], children: [], _children: [] });
      } else {
        firstNode.children.push({ name: entity[key], relToParent: predicates[key], children: [], _children: [] });
      }
    });
  }
}

export function translateFromTTDocument() {
  ttdocument["@context"];
  const firstNode = { name: ttdocument.entities[0]["rdfs:label"], relToParent: "", children: [], _children: [] } as TTGraphData;
  const excludedPredicates = [IM.MATCHED_TO, IM.HAS_STATUS, IM.STATUS, RDFS.COMMENT, RDF.TYPE, RDFS.LABEL];
  const predicateSet = new Set<string>();
  ttdocument.entities.forEach(entity => {
    const keys = Object.keys(entity);
    addAllPredicates(entity, keys, predicateSet, excludedPredicates);
  });
  addAllNodes(firstNode, ttdocument.entities[0], predicateSet);
  return firstNode;
}

function addAllNodes(node: TTGraphData, entity: any, predicateSet: Set<string>) {
  if (isObjectHasKeys(entity)) {
    for (const key in entity) {
      if (key === "sh:property") {
        entity[key].forEach((property: any) => {
          if (!Object.keys(property).includes("sh:node")) {
            node.children.push({ name: property["sh:path"].name, relToParent: property["sh:path"]["@id"], children: [], _children: [] });
          } else {
            const nodeEntity = findEntityByIri(ttdocument.entities as [], property["sh:node"]["@id"]) as any;
            const child = { name: nodeEntity["rdfs:label"], relToParent: property["sh:path"].name || property["sh:path"]["@id"], children: [], _children: [] };
            addAllNodes(child, nodeEntity, predicateSet);
            node.children.push(child);
          }
        });
      }
    }
  }
}

export function hasNodeChildrenByName(data: TTGraphData, name: string) {
  const nodes = [] as TTGraphData[];
  findNodeByName(data, name, nodes);

  if (isArrayHasLength(nodes) && (isArrayHasLength(nodes[0].children) || isArrayHasLength(nodes[0]._children))) {
    return true;
  }
  return false;
}

function findNodeByName(data: TTGraphData, name: string, nodes: TTGraphData[]) {
  if (data.name === name) {
    nodes.push(data);
  } else if (isArrayHasLength(data.children)) {
    data.children.forEach(child => {
      findNodeByName(child, name, nodes);
    });
  }
}

export function closeNodeByName(data: TTGraphData, name: string) {
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

function addAllPredicates(entity: any, keys: string[], predicateSet: Set<string>, excludedPredicates: string[]) {
  if (isObjectHasKeys(entity)) {
    keys.forEach(key => {
      const fullKey = getFullKeyIri(key);
      if (fullKey != "@id" && !excludedPredicates.includes(fullKey)) {
        predicateSet.add(fullKey);
      }
      if (isArrayHasLength(entity[key])) {
        entity[key].forEach((nestedEntity: any) => {
          addAllPredicates(nestedEntity, keys, predicateSet, excludedPredicates);
        });
      }
      if (isObjectHasKeys(entity[key])) {
        addAllPredicates(entity[key], keys, predicateSet, excludedPredicates);
      }
    });
  }
}

function getFullKeyIri(shortcutKey: string) {
  if (!shortcutKey.includes(":")) {
    return shortcutKey;
  }
  const parts = shortcutKey.split(":");
  return (ttdocument["@context"] as any)[parts[0]] + parts[1];
}

const ttdocument = {
  "@context": {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    im: "http://endhealth.info/im#",
    ods: "http://trudods#",
    owl: "http://www.w3.org/2002/07/owl#",
    sh: "http://www.w3.org/ns/shacl#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    entities: {
      "@id": "http://envhealth.info/im#entities",
      "@container": "@set"
    },
    individuals: {
      "@id": "http://envhealth.info/im#individuals",
      "@container": "@set"
    }
  },
  "@graph": {
    "@id": "ods:ods"
  },
  entities: [
    {
      "@id": "http://trudods#/OrgRefData",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "OrgRefData",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:schemaLocation",
            name: "schemaLocation"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:manifest"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest"
          }
        },
        {
          "sh:path": {
            "@id": "ods:codesystems"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/CodeSystems"
          }
        },
        {
          "sh:path": {
            "@id": "ods:organisations"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Manifest",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:version"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/Version"
          }
        },
        {
          "sh:path": {
            "@id": "ods:publicationtype"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PublicationType"
          }
        },
        {
          "sh:path": {
            "@id": "ods:publicationsource"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PublicationSource"
          }
        },
        {
          "sh:path": {
            "@id": "ods:publicationdate"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PublicationDate"
          }
        },
        {
          "sh:path": {
            "@id": "ods:publicationseqnum"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PublicationSeqNum"
          }
        },
        {
          "sh:path": {
            "@id": "ods:filecreationdatetime"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/FileCreationDateTime"
          }
        },
        {
          "sh:path": {
            "@id": "ods:recordcount"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/RecordCount"
          }
        },
        {
          "sh:path": {
            "@id": "ods:contentdescription"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/ContentDescription"
          }
        },
        {
          "sh:path": {
            "@id": "ods:primaryrolescope"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PrimaryRoleScope"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/Version",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Version",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PublicationType",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PublicationType",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PublicationSource",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PublicationSource",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PublicationDate",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PublicationDate",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PublicationSeqNum",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PublicationSeqNum",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/FileCreationDateTime",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "FileCreationDateTime",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/RecordCount",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "RecordCount",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/ContentDescription",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "ContentDescription",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PrimaryRoleScope",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PrimaryRoleScope",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:primaryrole"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Manifest/PrimaryRoleScope/PrimaryRole"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Manifest/PrimaryRoleScope/PrimaryRole",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PrimaryRole",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:displayName",
            name: "displayName"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/CodeSystems",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "CodeSystems",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:codesystem"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/CodeSystems/CodeSystem"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/CodeSystems/CodeSystem",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "CodeSystem",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:name",
            name: "name"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:oid",
            name: "oid"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:concept"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/CodeSystems/CodeSystem/concept"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/CodeSystems/CodeSystem/concept",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "concept",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:code",
            name: "code"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:displayName",
            name: "displayName"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Organisations",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:organisation"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Organisation",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:orgRecordClass",
            name: "orgRecordClass"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:Name"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:date"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date"
          }
        },
        {
          "sh:path": {
            "@id": "ods:orgid"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/OrgId"
          }
        },
        {
          "sh:path": {
            "@id": "ods:status"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Status"
          }
        },
        {
          "sh:path": {
            "@id": "ods:lastchangedate"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/LastChangeDate"
          }
        },
        {
          "sh:path": {
            "@id": "ods:geoloc"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/GeoLoc"
          }
        },
        {
          "sh:path": {
            "@id": "ods:roles"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles"
          }
        },
        {
          "sh:path": {
            "@id": "ods:rels"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels"
          }
        },
        {
          "sh:path": {
            "@id": "ods:succs"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs"
          }
        },
        {
          "sh:path": {
            "@id": "ods:contacts"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Contacts"
          }
        },
        {
          "sh:path": {
            "@id": "ods:refOnly",
            name: "refOnly"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Date",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:type"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/Type"
          }
        },
        {
          "sh:path": {
            "@id": "ods:start"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/Start"
          }
        },
        {
          "sh:path": {
            "@id": "ods:end"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/End"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/Type",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Type",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/Start",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Start",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Date/End",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "End",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/OrgId",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "OrgId",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:root",
            name: "root"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:assigningAuthorityName",
            name: "assigningAuthorityName"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:extension",
            name: "extension"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Status",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Status",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/LastChangeDate",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "LastChangeDate",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/GeoLoc",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "GeoLoc",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:location"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/GeoLoc/Location"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/GeoLoc/Location",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Location",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:AddrLn1"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:Town"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:County"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:PostCode"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:Country"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:UPRN"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:AddrLn2"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:AddrLn3"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Roles",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:role"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Role",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:uniqueRoleId",
            name: "uniqueRoleId"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:primaryRole",
            name: "primaryRole"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:date"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date"
          }
        },
        {
          "sh:path": {
            "@id": "ods:status"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Status"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Date",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:type"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/Type"
          }
        },
        {
          "sh:path": {
            "@id": "ods:start"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/Start"
          }
        },
        {
          "sh:path": {
            "@id": "ods:end"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/End"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/Type",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Type",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/Start",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Start",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Date/End",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "End",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Roles/Role/Status",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Status",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Rels",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:rel"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Rel",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:uniqueRelId",
            name: "uniqueRelId"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:date"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date"
          }
        },
        {
          "sh:path": {
            "@id": "ods:status"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Status"
          }
        },
        {
          "sh:path": {
            "@id": "ods:target"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Date",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:type"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/Type"
          }
        },
        {
          "sh:path": {
            "@id": "ods:start"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/Start"
          }
        },
        {
          "sh:path": {
            "@id": "ods:end"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/End"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/Type",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Type",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/Start",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Start",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Date/End",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "End",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Status",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Status",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Target",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:orgid"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target/OrgId"
          }
        },
        {
          "sh:path": {
            "@id": "ods:primaryroleid"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target/PrimaryRoleId"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target/OrgId",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "OrgId",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:root",
            name: "root"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:assigningAuthorityName",
            name: "assigningAuthorityName"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:extension",
            name: "extension"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Rels/Rel/Target/PrimaryRoleId",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PrimaryRoleId",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:uniqueRoleId",
            name: "uniqueRoleId"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Succs",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:succ"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Succ",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:uniqueSuccId",
            name: "uniqueSuccId"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:date"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date"
          }
        },
        {
          "sh:path": {
            "@id": "ods:Type"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:target"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target"
          }
        },
        {
          "sh:path": {
            "@id": "ods:forwardSuccession",
            name: "forwardSuccession"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Date",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:type"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date/Type"
          }
        },
        {
          "sh:path": {
            "@id": "ods:start"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date/Start"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date/Type",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Type",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Date/Start",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Start",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Target",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:orgid"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target/OrgId"
          }
        },
        {
          "sh:path": {
            "@id": "ods:primaryroleid"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target/PrimaryRoleId"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target/OrgId",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "OrgId",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:root",
            name: "root"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:assigningAuthorityName",
            name: "assigningAuthorityName"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:extension",
            name: "extension"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Succs/Succ/Target/PrimaryRoleId",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "PrimaryRoleId",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:id",
            name: "id"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:uniqueRoleId",
            name: "uniqueRoleId"
          },
          "sh:maxCount": 1
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Contacts",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Contacts",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:contact"
          },
          "sh:node": {
            "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Contacts/Contact"
          }
        }
      ]
    },
    {
      "@id": "http://trudods#/OrgRefData/Organisations/Organisation/Contacts/Contact",
      "rdf:type": [
        {
          "@id": "sh:NodeShape"
        }
      ],
      "rdfs:label": "Contact",
      "sh:property": [
        {
          "sh:path": {
            "@id": "ods:type",
            name: "type"
          },
          "sh:maxCount": 1
        },
        {
          "sh:path": {
            "@id": "ods:value",
            name: "value"
          },
          "sh:maxCount": 1
        }
      ]
    }
  ]
};
