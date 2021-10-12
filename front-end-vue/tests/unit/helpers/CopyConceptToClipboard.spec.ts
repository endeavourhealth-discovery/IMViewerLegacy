import { copyConceptToClipboard, conceptObjectToCopyString } from "@/helpers/CopyConceptToClipboard";

describe("CopyConceptToClipboard", () => {
  const CONFIG = [
    { label: "Name", predicate: "http://www.w3.org/2000/01/rdf-schema#label", type: "TextWithLabel", size: "50%", order: 0 },
    { label: "Iri", predicate: "@id", type: "TextWithLabel", size: "50%", order: 1 },
    { label: "Status", predicate: "http://endhealth.info/im#status", type: "ObjectNameWithLabel", size: "50%", order: 2 },
    { label: "Types", predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", type: "ArrayObjectNamesToStringWithLabel", size: "50%", order: 3 },
    { label: "Description", predicate: "http://www.w3.org/2000/01/rdf-schema#comment", type: "TextHTMLWithLabel", size: "100%", order: 4 },
    { label: "Divider", predicate: "None", type: "Divider", size: "100%", order: 5 },
    { label: "Inferred", predicate: "inferred", type: "TextDefinition", size: "50%", order: 6 },
    { label: "Has sub types", predicate: "subtypes", type: "ArrayObjectNameListboxWithLabel", size: "50%", order: 7 },
    { label: "Divider", predicate: "None", type: "Divider", size: "100%", order: 8 },
    { label: "Axioms", predicate: "axioms", type: "TextDefinition", size: "100%", order: 9 },
    { label: "Divider", predicate: "None", type: "Divider", size: "100%", order: 10 },
    { label: "Data model properties", predicate: "dataModelProperties", type: "DataModelProperties", size: "100%", order: 11 }
  ];
  describe("copyConceptToClipboard", () => {
    it("can copy concept to clipboard", async () => {
      const concept = {
        "@id": "http://snomed.info/sct#47518006",
        "http://endhealth.info/im#status": { "@id": "http://endhealth.info/im#Active", name: "Active" },
        "http://www.w3.org/2000/01/rdf-schema#label": "Scoliosis caused by radiation (disorder)"
      };
      expect(copyConceptToClipboard(concept, CONFIG)).toBe(
        "Iri: http://snomed.info/sct#47518006,\nStatus: Active,\nName: Scoliosis caused by radiation (disorder)"
      );
    });

    it("can copy concept to clipboard ___ empty arrays", async () => {
      const concept = {
        "@id": "http://snomed.info/sct#47518006",
        "http://endhealth.info/im#status": { "@id": "http://endhealth.info/im#Active", name: "Active" },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [],
        "http://www.w3.org/2000/01/rdf-schema#label": "Scoliosis caused by radiation (disorder)",
        subtypes: [],
        dataModelProperties: []
      };
      expect(copyConceptToClipboard(concept, CONFIG)).toBe(
        "Iri: http://snomed.info/sct#47518006,\nStatus: Active,\nName: Scoliosis caused by radiation (disorder)"
      );
    });

    it("can create copy return object ___ no config", () => {
      const testData = {
        name: "Scoliosis deformity of spine (disorder)",
        iri: "http://snomed.info/sct#298382003",
        code: "298382003",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { name: "Snomed-CT code", "@id": "http://endhealth.info/im#SnomedCodeScheme" },
        entityType: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
        isDescendentOf: [],
        weighting: 0,
        match: "Scoliosis"
      };
      const returnData = copyConceptToClipboard(testData);
      expect(returnData).toEqual(
        "name: Scoliosis deformity of spine (disorder),\niri: http://snomed.info/sct#298382003,\ncode: 298382003,\nstatus: Active,\nscheme: Snomed-CT code,\nentityType: [\n\tClass\n],\nweighting: 0,\nmatch: Scoliosis"
      );
    });

    it("can create copy return object ___ no config ___ 0 type length", () => {
      const testData = {
        name: "Scoliosis deformity of spine (disorder)",
        iri: "http://snomed.info/sct#298382003",
        code: "298382003",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { name: "Snomed-CT code", "@id": "http://endhealth.info/im#SnomedCodeScheme" },
        entityType: [],
        isDescendentOf: [],
        weighting: 0,
        match: "Scoliosis"
      };
      const returnData = copyConceptToClipboard(testData);
      expect(returnData).toEqual(
        "name: Scoliosis deformity of spine (disorder),\niri: http://snomed.info/sct#298382003,\ncode: 298382003,\nstatus: Active,\nscheme: Snomed-CT code,\nweighting: 0,\nmatch: Scoliosis"
      );
    });
  });

  describe("ConceptObjectToCopyString", () => {
    it("can convert conceptObjectToCopyString ___ object 0 1", () => {
      expect(
        conceptObjectToCopyString("http://endhealth.info/im#status", { "@id": "http://endhealth.info/im#Active", name: "Active" }, 0, 1, CONFIG)
      ).toStrictEqual({
        label: "Status",
        value: "Status: Active"
      });
    });

    it("can convert conceptObjectToCopyString ___ object 1 4", () => {
      expect(
        conceptObjectToCopyString("http://endhealth.info/im#status", { "@id": "http://endhealth.info/im#Active", name: "Active" }, 1, 4, CONFIG)
      ).toStrictEqual({
        label: "Status",
        value: "Status: Active,\n"
      });
    });
  });
});
