import { isOfTypes, isValueSet, isProperty, getIconFromType, getColourFromType } from "@/helpers/ConceptTypeMethods";
import { IM } from "@/vocabulary/IM";

describe("ConceptTypeMethods", () => {
  const testConceptType = [{ "@id": "http://endhealth.info/im#Concept", name: "Concept" }];
  const testSetType = [{ "@id": "http://endhealth.info/im#ValueSet", name: "Value set" }];
  const testDataModelType = [
    { "@id": "http://www.w3.org/2000/01/rdf-schema#Class", name: "Class" },
    { "@id": "http://www.w3.org/ns/shacl#NodeShape", name: "Node shape" }
  ];
  const testPropertyType = [{ "@id": "http://endhealth.info/im#DataProperty", name: "Data property" }];
  const testQueryType = [{ "@id": "http://endhealth.info/im#QueryTemplate", name: "Query template" }];
  const testFolder = [{ "@id": "http://endhealth.info/im#Folder", name: "Folder" }];

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

  describe("isProperty", () => {
    it("returns true if property", () => {
      expect(isProperty(testPropertyType)).toBe(true);
    });

    it("returns false if not property", () => {
      expect(isValueSet(testDataModelType)).toBe(false);
    });
  });

  describe("getIconFromType", () => {
    it("returns icon for nodeshape", () => {
      expect(getIconFromType(testDataModelType)).toBe("fas fa-fw fa-project-diagram");
    });

    it("returns icon for property", () => {
      expect(getIconFromType(testPropertyType)).toBe("far fa-fw fa-edit");
    });

    it("returns icon for valueset", () => {
      expect(getIconFromType(testSetType)).toBe("fas fa-fw fa-tasks");
    });

    it("returns icon for folder", () => {
      expect(getIconFromType(testFolder)).toBe("fas fa-fw fa-folder");
    });

    it("returns icon for query", () => {
      expect(getIconFromType(testQueryType)).toBe("fas fa-fw fa-search");
    });

    it("returns default icon, type not found", () => {
      expect(getIconFromType([])).toBe("far fa-fw fa-lightbulb");
    });
  });

  describe("getColourFromType", () => {
    it("returns correct colour for nodeshape", () => {
      expect(getColourFromType(testDataModelType)).toBe("#781c8188");
    });

    it("returns correct colour for property", () => {
      expect(getColourFromType(testPropertyType)).toBe("#d9212088");
    });

    it("returns correct colour for valueset", () => {
      expect(getColourFromType(testSetType)).toBe("#62ac9a88");
    });

    it("returns correct colour for folder", () => {
      expect(getColourFromType(testFolder)).toBe("#4063b088");
    });

    it("returns correct colour for query", () => {
      expect(getColourFromType(testQueryType)).toBe("#abbe5188");
    });

    it("returns correct colour for default no type", () => {
      expect(getColourFromType([])).toBe("#e39a3688");
    });
  });
});
