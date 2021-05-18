import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import store from "@/store/index";
import { IM } from "@/vocabulary/IM";

describe("state", () => {
  it("should start with the correct values", () => {
    const test = new Map<string, boolean>();
    expect(store.state.loading).toEqual(test);
    expect(store.state.conceptIri).toBe("http://www.w3.org/2002/07/owl#Thing");
    expect(store.state.conceptAggregate).toEqual({});
    expect(store.state.history).toEqual([]);
    expect(store.state.searchResults).toEqual([]);
    expect(store.state.currentUser).toEqual({});
    expect(store.state.registeredUsername).toBe("");
    expect(store.state.isLoggedIn).toBeFalsy();
    expect(store.state.snomedLicenseAccepted).toBeNull();
    expect(store.state.historyCount).toBe(0);
    expect(store.state.filters).toEqual({
      selectedStatus: ["Active", "Draft"],
      selectedSchemes: [
        {
          iri: IM.DISCOVERY_CODE,
          name: "Discovery code"
        },
        {
          iri: IM.CODE_SCHEME_SNOMED,
          name: "Snomed-CT code"
        },
        {
          iri: IM.CODE_SCHEME_TERMS,
          name: "Term based code"
        }
      ],
      selectedTypes: [
        "Class",
        "ObjectProperty",
        "DataProperty",
        "DataType",
        "Annotation",
        "Individual",
        "Record",
        "ValueSet",
        "Folder",
        "Legacy"
      ]
    })
  });
});

describe("mutations", () => {
  it("can updateConceptIri", () => {
    const testConceptIri = "http://www.endhealth.info/im#test";
    store.commit("updateConceptIri", testConceptIri);
    expect(store.state.conceptIri).toEqual(testConceptIri);
  });

  it("can updateConceptAggregate", () => {
    const testConceptAggregate = new ConceptAggregate(
      {"@id": "http://endhealth.info/im#testConcept"},
      [{
        iri: "childIri",
        hasChildren: true,
        name: "childName",
        type: {elements: [{ iri: "test", name: "test" }]}
      }],
      [{
        iri: "parentIri",
        hasChildren: true,
        name: "parentName",
        type: {elements: [{ iri: "test1", name: "test2" }]}
      }]
    )
    store.commit("updateConceptAggregate", testConceptAggregate);
    expect(store.state.conceptAggregate).toEqual(testConceptAggregate);
  });

  it("can updateHistory", () => {
    const testHistory = { url: "testUrl", conceptName: "testName", view: "testVuew" };
    store.commit("updateHistory", testHistory);
    expect(store.state.history).toEqual([testHistory]);
  });

  it("can updateHistory ___ duplicate", () => {
    const testHistory = { url: "testUrl", conceptName: "testName", view: "testVuew" };
    store.commit("updateHistory", testHistory);
    store.commit("updateHistory", testHistory);
    expect(store.state.history).toEqual([testHistory]);
  });

  it("can updateSearchResults", () => {
    const testResult = {
      name: "testConcept",
      iri: "testIri",
      scheme: {
        name: "testScheme",
        iri: "testSchemeIri"
      },
      code: "testCode",
      conceptType: {
        elements: [{ iri: "testType", name: "testType" }]
      },
      isDescendantOf: [],
      match: "testMatch",
      weighting: 0,
      status: { iri: "testStatus", name: "testStatus" }
    };
    store.commit("updateSearchResults", testResult);
    expect(store.state.searchResults).toEqual(testResult);
  });
})
