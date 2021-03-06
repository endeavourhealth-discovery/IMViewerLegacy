import { flushPromises, shallowMount } from "@vue/test-utils";
import Mappings from "@/components/concept/Mappings.vue";
import SimpleMaps from "@/components/concept/mapping/SimpleMaps.vue";
import ProgressSpinner from "primevue/progressspinner";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import EntityService from "@/services/EntityService";
import { IM } from "@/vocabulary/IM";

describe("Mappings.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;

  const HAS_MAPS = {
    "http://endhealth.info/im#hasMap": [
      {
        "http://endhealth.info/im#combinationOf": [
          {
            "http://endhealth.info/im#oneOf": [
              {
                "http://endhealth.info/im#mappedTo": { "@id": "http://endhealth.info/OPCS4#X109", name: "Unspecified amputation of foot" },
                "http://endhealth.info/im#mapAdvice": "ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE",
                "http://endhealth.info/im#mapPriority": 1,
                "http://endhealth.info/im#assuranceLevel": { "@id": "http://endhealth.info/im#NationallyAssuredUK", name: "Nationally assured UK level" }
              }
            ]
          },
          {
            "http://endhealth.info/im#oneOf": [
              {
                "http://endhealth.info/im#mappedTo": { "@id": "http://endhealth.info/OPCS4#Z942", name: "Right sided operation" },
                "http://endhealth.info/im#mapAdvice": "ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE",
                "http://endhealth.info/im#mapPriority": 1,
                "http://endhealth.info/im#assuranceLevel": { "@id": "http://endhealth.info/im#NationallyAssuredUK", name: "Nationally assured UK level" }
              }
            ]
          }
        ]
      }
    ]
  } as any;
  const MATCHED_TOS = {
    "@id": "http://snomed.info/sct#298382003",
    "http://endhealth.info/im#matchedTo": [
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", name: "Amputation of right foot", scheme: "EMIS (inc. Read2 like) namespace" },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", name: "Amputation of right foot", scheme: "EMIS (inc. Read2 like) namespace" }
    ]
  } as any;
  const NAMESPACES = [
    { iri: "http://endhealth.info/bc#", prefix: "bc", name: "Barts Cerner namespace" },
    { iri: "http://endhealth.info/ceg16#", prefix: "ceg13", name: "CEG ethnicity 16+ category" },
    { iri: "http://endhealth.info/im#", prefix: "im", name: "Discovery namespace" },
    { iri: "http://endhealth.info/emis#", prefix: "emis", name: "EMIS (inc. Read2 like) namespace" },
    { iri: "http://endhealth.info/icd10#", prefix: "icd10", name: "ICD10 namespace" },
    { iri: "http://endhealth.info/reports#", prefix: "reports", name: "IM internal reports" },
    { iri: "http://endhealth.info/kchapex#", prefix: "kchapex", name: "KCH Apex codes" },
    { iri: "http://endhealth.info/kchwinpath#", prefix: "kchwinpath", name: "KCH Winpath codes" },
    { iri: "http://endhealth.info/nhsethnic2001#", prefix: "nhse2001", name: "NHS Ethnicitity categories 2001 census" },
    { iri: "http://endhealth.info/ods#", prefix: "ods", name: "ODS code scheme" },
    { iri: "http://endhealth.info/opcs4#", prefix: "opcs4", name: "OPCS4 namespace" },
    { iri: "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#", prefix: "orole", name: "OPS roles namespace" },
    { iri: "http://www.w3.org/2002/07/owl#", prefix: "owl", name: "OWL2 namespace" },
    { iri: "http://www.w3.org/ns/prov#", prefix: "prov", name: "PROV namespace" },
    { iri: "http://endhealth.info/prsb#", prefix: "prsb", name: "PRSB namespace" },
    { iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#", prefix: "rdf", name: "RDF namespace" },
    { iri: "http://www.w3.org/2000/01/rdf-schema#", prefix: "rdfs", name: "RDFS namespace" },
    { iri: "http://www.w3.org/ns/shacl#", prefix: "sh", name: "SHACL namespace" },
    { iri: "http://snomed.info/sct#", prefix: "sn", name: "Snomed-CT namespace" },
    { iri: "http://endhealth.info/tpp#", prefix: "tpp", name: "TPP (inc.CTV3) namespace" },
    { iri: "http://endhealth.info/vision#", prefix: "vis", name: "Vision (incl. Read2) namespace" },
    { iri: "http://www.w3.org/2001/XMLSchema#", prefix: "xsd", name: "xsd namespace" }
  ];

  beforeEach(async () => {
    jest.resetAllMocks();
    mockStore = {
      state: { loading: { get: jest.fn().mockReturnValue(false) } },
      commit: jest.fn()
    };

    mockToast = { add: jest.fn() };

    EntityService.getPartialEntity = jest
      .fn()
      .mockResolvedValueOnce(HAS_MAPS)
      .mockResolvedValueOnce(MATCHED_TOS);

    EntityService.getNamespaces = jest.fn().mockResolvedValue(NAMESPACES);

    wrapper = shallowMount(Mappings, {
      global: {
        components: { ProgressSpinner, OrganizationChart, OverlayPanel, SimpleMaps },
        mocks: { $store: mockStore, $toast: mockToast }
      },
      props: { conceptIri: "http://snomed.info/sct#723312009" }
    });
    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("watches conceptIri", async () => {
    wrapper.vm.getMappings = jest.fn().mockResolvedValue(true);
    wrapper.vm.createChartStructure = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#723312009");
    expect(wrapper.vm.getMappings).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.vm.createChartStructure).toHaveBeenCalledTimes(1);
  });

  it("can get mappings ___ success", async () => {
    EntityService.getPartialEntity = jest
      .fn()
      .mockResolvedValueOnce(HAS_MAPS)
      .mockResolvedValueOnce(MATCHED_TOS);
    wrapper.vm.getMappings();
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(2);
    expect(EntityService.getPartialEntity).toHaveBeenNthCalledWith(1, "http://snomed.info/sct#723312009", ["http://endhealth.info/im#hasMap"]);
    expect(EntityService.getPartialEntity).toHaveBeenLastCalledWith("http://snomed.info/sct#723312009", ["http://endhealth.info/im#matchedTo"]);
    expect(wrapper.vm.mappings).toStrictEqual(HAS_MAPS[IM.HAS_MAP]);
    expect(wrapper.vm.simpleMaps).toStrictEqual(MATCHED_TOS[IM.MATCHED_TO]);
  });

  it("can get mappings ___ fail no hasMap", async () => {
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ comboOf: [1, 2] });
    wrapper.vm.getMappings();
    await flushPromises();
    expect(wrapper.vm.mappings).toStrictEqual([]);
    expect(wrapper.vm.data).toStrictEqual({});
  });

  it("can create chartTableNode", () => {
    expect(
      wrapper.vm.createChartTableNode([{ assuranceLevel: "TestAssurance", iri: "TestIri", name: "TestName", priority: 1 }], "0", 1, "childList")
    ).toStrictEqual({
      key: "0_1",
      type: "childList",
      data: { mapItems: [{ assuranceLevel: "TestAssurance", iri: "TestIri", name: "TestName", priority: 1 }] }
    });
  });

  it("can createChartMapNode ___ OneOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#oneOf", "0_1", 2)).toStrictEqual({
      key: "0_1_2",
      type: "oneOf",
      data: { label: "One of" },
      children: []
    });
  });

  it("can createChartMapNode ___ ComboOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#combinationOf", "0_1", 2)).toStrictEqual({
      key: "0_1_2",
      type: "comboOf",
      data: { label: "Combination of" },
      children: []
    });
  });

  it("can createChartMapNode ___ someOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#someOf", "0_1", 2)).toStrictEqual({
      key: "0_1_2",
      type: "someOf",
      data: { label: "Some of" },
      children: []
    });
  });

  it("can createChartMapNode ___ none", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#none", "0_1", 2)).toStrictEqual(undefined);
  });

  it("can generateChildNodes", () => {
    expect(wrapper.vm.generateChildNodes(HAS_MAPS[IM.HAS_MAP], "0", 0)).toStrictEqual([
      {
        children: [
          {
            children: [
              {
                data: {
                  mapItems: [
                    {
                      assuranceLevel: "Nationally assured UK level",
                      iri: "http://endhealth.info/OPCS4#X109",
                      name: "Unspecified amputation of foot",
                      priority: 1
                    }
                  ]
                },
                key: "0_0_0_0",
                type: "childList"
              }
            ],
            data: { label: "One of" },
            key: "0_0_0",
            type: "oneOf"
          },
          {
            children: [
              {
                data: {
                  mapItems: [
                    { assuranceLevel: "Nationally assured UK level", iri: "http://endhealth.info/OPCS4#Z942", name: "Right sided operation", priority: 1 }
                  ]
                },
                key: "0_0_1_0",
                type: "childList"
              }
            ],
            data: { label: "One of" },
            key: "0_0_1",
            type: "oneOf"
          }
        ],
        data: { label: "Combination of" },
        key: "0_0",
        type: "comboOf"
      }
    ]);
  });

  it("can generateChildNodes ___ mapNode fail", () => {
    wrapper.vm.createChartMapNode = jest.fn().mockReturnValue(undefined);
    expect(wrapper.vm.generateChildNodes(HAS_MAPS[IM.HAS_MAP])).toStrictEqual([]);
  });

  it("can createChartStructure", () => {
    expect(wrapper.vm.createChartStructure(HAS_MAPS[IM.HAS_MAP])).toStrictEqual({
      key: "0",
      type: "hasMap",
      data: { label: "Has map" },
      children: [
        {
          key: "0_0",
          type: "comboOf",
          data: { label: "Combination of" },
          children: [
            {
              key: "0_0_0",
              type: "oneOf",
              data: { label: "One of" },
              children: [
                {
                  key: "0_0_0_0",
                  type: "childList",
                  data: {
                    mapItems: [
                      {
                        name: "Unspecified amputation of foot",
                        iri: "http://endhealth.info/OPCS4#X109",
                        priority: 1,
                        assuranceLevel: "Nationally assured UK level"
                      }
                    ]
                  }
                }
              ]
            },
            {
              key: "0_0_1",
              type: "oneOf",
              data: { label: "One of" },
              children: [
                {
                  key: "0_0_1_0",
                  type: "childList",
                  data: {
                    mapItems: [
                      { name: "Right sided operation", iri: "http://endhealth.info/OPCS4#Z942", priority: 1, assuranceLevel: "Nationally assured UK level" }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          key: "0_1",
          type: "simpleMaps",
          data: { label: "Simple maps" },
          children: [
            {
              key: "0_1_0",
              type: "simpleMapsList",
              data: {
                mapItems: [
                  {
                    name: "Amputation of right foot",
                    iri: "http://endhealth.info/emis#^ESCTAM784250",
                    scheme: "EMIS (inc. Read2 like) namespace",
                    code: "^ESCTAM784250"
                  },
                  {
                    name: "Amputation of right foot",
                    iri: "http://endhealth.info/emis#^ESCTAM784250",
                    scheme: "EMIS (inc. Read2 like) namespace",
                    code: "^ESCTAM784250"
                  }
                ]
              }
            }
          ]
        }
      ]
    });
  });

  it("can createChartStructure ___ complex only", () => {
    wrapper.vm.simpleMaps = [];
    expect(wrapper.vm.createChartStructure(HAS_MAPS[IM.HAS_MAP])).toStrictEqual({
      key: "0",
      type: "hasMap",
      data: { label: "Has map" },
      children: [
        {
          key: "0_0",
          type: "comboOf",
          data: { label: "Combination of" },
          children: [
            {
              key: "0_0_0",
              type: "oneOf",
              data: { label: "One of" },
              children: [
                {
                  key: "0_0_0_0",
                  type: "childList",
                  data: {
                    mapItems: [
                      {
                        name: "Unspecified amputation of foot",
                        iri: "http://endhealth.info/OPCS4#X109",
                        priority: 1,
                        assuranceLevel: "Nationally assured UK level"
                      }
                    ]
                  }
                }
              ]
            },
            {
              key: "0_0_1",
              type: "oneOf",
              data: { label: "One of" },
              children: [
                {
                  key: "0_0_1_0",
                  type: "childList",
                  data: {
                    mapItems: [
                      { name: "Right sided operation", iri: "http://endhealth.info/OPCS4#Z942", priority: 1, assuranceLevel: "Nationally assured UK level" }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    });
  });

  it("can create chart structure ___ empty mappingObject", () => {
    wrapper.vm.simpleMaps = [];
    expect(wrapper.vm.createChartStructure([])).toStrictEqual([]);
  });

  it("can create chart structure ___ simple maps only", () => {
    expect(wrapper.vm.createChartStructure([])).toStrictEqual({
      children: [
        {
          children: [
            {
              data: {
                mapItems: [
                  {
                    code: "^ESCTAM784250",
                    iri: "http://endhealth.info/emis#^ESCTAM784250",
                    name: "Amputation of right foot",
                    scheme: "EMIS (inc. Read2 like) namespace"
                  },
                  {
                    code: "^ESCTAM784250",
                    iri: "http://endhealth.info/emis#^ESCTAM784250",
                    name: "Amputation of right foot",
                    scheme: "EMIS (inc. Read2 like) namespace"
                  }
                ]
              },
              key: "0_0_0",
              type: "simpleMapsList"
            }
          ],
          data: { label: "Simple maps" },
          key: "0_0",
          type: "simpleMaps"
        }
      ],
      data: { label: "Has map" },
      key: "0",
      type: "hasMap"
    });
  });

  it("can generateSimpleMapsNodes ___ isArrayHasLength", () => {
    wrapper.vm.createChartTableNode = jest.fn().mockReturnValue({
      data: {
        mapItems: [
          {
            code: "^ESCTAM784250",
            iri: "http://endhealth.info/emis#^ESCTAM784250",
            name: "Amputation of right foot",
            scheme: "EMIS (inc. Read2 like) namespace"
          },
          {
            code: "^ESCTAM784250",
            iri: "http://endhealth.info/emis#^ESCTAM784250",
            name: "Amputation of right foot",
            scheme: "EMIS (inc. Read2 like) namespace"
          }
        ]
      },
      key: "location_1",
      type: "simpleMapsList"
    });
    expect(wrapper.vm.generateSimpleMapsNodes(MATCHED_TOS[IM.MATCHED_TO], "location", 1)).toStrictEqual([
      {
        data: {
          mapItems: [
            {
              code: "^ESCTAM784250",
              iri: "http://endhealth.info/emis#^ESCTAM784250",
              name: "Amputation of right foot",
              scheme: "EMIS (inc. Read2 like) namespace"
            },
            {
              code: "^ESCTAM784250",
              iri: "http://endhealth.info/emis#^ESCTAM784250",
              name: "Amputation of right foot",
              scheme: "EMIS (inc. Read2 like) namespace"
            }
          ]
        },
        key: "location_1",
        type: "simpleMapsList"
      }
    ]);
    expect(wrapper.vm.createChartTableNode).toHaveBeenCalledWith(
      [
        {
          code: "^ESCTAM784250",
          iri: "http://endhealth.info/emis#^ESCTAM784250",
          name: "Amputation of right foot",
          scheme: "EMIS (inc. Read2 like) namespace"
        },
        {
          code: "^ESCTAM784250",
          iri: "http://endhealth.info/emis#^ESCTAM784250",
          name: "Amputation of right foot",
          scheme: "EMIS (inc. Read2 like) namespace"
        }
      ],
      "location",
      1,
      "simpleMapsList"
    );
  });

  it("can generateSimpleMapsNodes ___ not isArrayHasLength", () => {
    wrapper.vm.createChartTableNode = jest.fn().mockReturnValue({
      data: {
        mapItems: []
      },
      key: "location_1",
      type: "simpleMapsList"
    });
    expect(wrapper.vm.generateSimpleMapsNodes([], "location", 1)).toStrictEqual([{ data: { mapItems: [] }, key: "location_1", type: "simpleMapsList" }]);
    expect(wrapper.vm.createChartTableNode).toHaveBeenCalledWith([], "location", 1, "simpleMapsList");
  });

  it("can generateSimpleMapsNamespaces ___ isArray ___ found", () => {
    wrapper.vm.simpleMaps = [
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "unknown"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "unknown" }
    ];
    wrapper.vm.getSimpleMapsNamespaces();
    expect(wrapper.vm.simpleMaps).toStrictEqual([
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "EMIS (inc. Read2 like) namespace"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "EMIS (inc. Read2 like) namespace" }
    ]);
  });

  it("can generateSimpleMapsNamespaces ___ not isArray ___ found", () => {
    wrapper.vm.simpleMaps = [
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "unknown"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "unknown" }
    ];
    wrapper.vm.namespaces = [];
    wrapper.vm.getSimpleMapsNamespaces();
    expect(wrapper.vm.simpleMaps).toStrictEqual([
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "unknown"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "unknown" }
    ]);
  });

  it("can generateSimpleMapsNamespaces ___ isArray ___ not found", () => {
    wrapper.vm.simpleMaps = [
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "unknown"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "unknown" }
    ];
    wrapper.vm.namespaces = [{ iri: "testIri", name: "testName" }];
    wrapper.vm.getSimpleMapsNamespaces();
    expect(wrapper.vm.simpleMaps).toStrictEqual([
      {
        "@id": "http://endhealth.info/emis#^ESCTAM784250",
        code: "^ESCTAM784250",
        name: "Amputation of right foot",
        scheme: "None"
      },
      { "@id": "http://endhealth.info/emis#^ESCTAM784250", code: "^ESCTAM784250", name: "Amputation of right foot", scheme: "None" }
    ]);
  });

  it("can get bypriority ___ 1", () => {
    expect(wrapper.vm.byPriority({ priority: 9 }, { priority: 7 })).toBe(1);
  });

  it("can get bypriority ___ -1", () => {
    expect(wrapper.vm.byPriority({ priority: 7 }, { priority: 10 })).toBe(-1);
  });

  it("can get bypriority ___ 0", () => {
    expect(wrapper.vm.byPriority({ priority: 2 }, { priority: 2 })).toBe(0);
  });

  it("can get byScheme ___ 1", () => {
    expect(wrapper.vm.byScheme({ scheme: 9 }, { scheme: 7 })).toBe(1);
  });

  it("can get byScheme ___ -1", () => {
    expect(wrapper.vm.byScheme({ scheme: 7 }, { scheme: 10 })).toBe(-1);
  });

  it("can get byScheme ___ 0", () => {
    expect(wrapper.vm.byScheme({ scheme: 2 }, { scheme: 2 })).toBe(0);
  });
});
