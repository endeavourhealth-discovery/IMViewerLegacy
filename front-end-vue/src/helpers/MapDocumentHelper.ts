import { RMLMapping } from "@/models/mapping/RMLMapping";

export function buildMapDocumentString(mappings: RMLMapping[]): string {
    const mapDocumentString = `
    @prefix rr: <http://www.w3.org/ns/r2rml#> .
    @prefix rml: <http://semweb.mmlab.be/ns/rml#> .
    @prefix ql: <http://semweb.mmlab.be/ns/ql#> .
    @prefix im: <http://endhealth.info/im#> .
    @prefix fno: <https://w3id.org/function/ontology#> .
    @prefix fnml: <http://semweb.mmlab.be/ns/fnml#> .
    @prefix shacl: <http://www.w3.org/ns/shacl#> .
    @prefix rs: <http://prsb.info/rs#> .
    @base <http://endhealth.info/mapping/prsb.ttl#> .
    `;
    mappings.forEach((mapping) => {
        let subjectMap = `
      <#${mapping.name}> a rr:TriplesMap;
      rml:logicalSource [
        rml:source "${mapping.source}";
        rml:referenceFormulation ${mapping.referenceFormulation};
        rml:iterator "${mapping.iterator}"
      ];
      `;
        if (mapping.subjectMapType === "functionValue") {
            subjectMap += `
        rr:subjectMap [
          fnml:functionValue [
            rr:predicateObjectMap [
              rr:predicate fno:executes ;
              rr:objectMap [ rr:constant im:${mapping.subjectMapValue} ] 
            ];
          ];
          rr:class ${mapping.class}
        ];
        `;
        } else {
            subjectMap += `
        rr:subjectMap [
          rr:objectMap [
            rml:constant "http://endhealth.info/im#PRSB"
          ]
          rr:class ${mapping.class}
        ];
        `
        }
    });

    return mapDocumentString;
}