import { isOfTypes, isValueSet, isProperty, getIconFromType, getColourFromType } from "@/helpers/ConceptTypeMethods";
import { IM } from "@/vocabulary/IM";

describe("ConceptTypeMethods", () => {
  const testConceptType = [{ "@id": "http://endhealth.info/im#Concept", name: "Concept" }];
  const testSetType = [{ "@id": "http://endhealth.info/im#ValueSet", name: "Value set" }];
  const testDataModelType = [
    { "@id": "http://www.w3.org/2000/01/rdf-schema#Class", name: "Class" },
    { "@id": "http://www.w3.org/ns/shacl#NodeShape", name: "Node shape" }
  ];
  const testQueryType = [{ "@id": "http://endhealth.info/im#QueryTemplate", name: "Query template" }];

  describe("isOfTypes", () => {
    it("returns false if no conceptTypeElements", () => {
      expect(isOfTypes([], IM.CONCEPT)).toBe(false);
    });

    it("returns true when type found", () => {
      expect(isOfTypes(testConceptType, IM.CONCEPT)).toBe(true);
    });
  });

  describe("isValueSet", () => {
    it("returns true if valueset", () => {
      expect(isValueSet(testSetType)).toBe(true);
    });

    it("returns false if not valueset", () => {
      expect(isValueSet(testDataModelType)).toBe(false);
    });
  });
});
