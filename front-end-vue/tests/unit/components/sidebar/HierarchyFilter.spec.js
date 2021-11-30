import HierarchyFilter from "@/components/sidebar/HierarchyFilter.vue";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import { flushPromises, shallowMount } from "@vue/test-utils";
import EntityService from "@/services/EntityService";
import ConfigService from "@/services/ConfigService";
import { IM } from "@/vocabulary/IM";

const CONFIG = {
  schemeOptions: ["http://endhealth.info/im#", "http://snomed.info/sct#"],
  statusOptions: ["http://endhealth.info/im#Active", "http://endhealth.info/im#Draft"],
  typeOptions: [
    "http://endhealth.info/im#Concept",
    "http://endhealth.info/im#ConceptSet",
    "http://endhealth.info/im#ConceptSetGroup",
    "http://endhealth.info/im#Folder",
    "http://www.w3.org/ns/shacl#NodeShape",
    "http://www.w3.org/2002/07/owl#ObjectProperty",
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
    "http://endhealth.info/im#QueryTemplate",
    "http://endhealth.info/im#ValueSet"
  ]
};
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

const STATUS = [
  {
    name: "Active",
    hasChildren: false,
    type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
    "@id": "http://endhealth.info/im#Active"
  },
  {
    name: "Draft",
    hasChildren: false,
    type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
    "@id": "http://endhealth.info/im#Draft"
  },
  {
    name: "Inactive",
    hasChildren: false,
    type: [{ name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" }],
    "@id": "http://endhealth.info/im#Inactive"
  }
];

const TYPES = [
  {
    name: "Concept",
    hasChildren: true,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://endhealth.info/im#Concept"
  },
  {
    name: "Concept Set",
    hasChildren: false,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://endhealth.info/im#ConceptSet"
  },
  {
    name: "Concept set group",
    hasChildren: false,
    type: [
      { name: "Organisation  (record type)", "@id": "http://endhealth.info/im#Organisation" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://endhealth.info/im#ConceptSetGroup"
  },
  {
    name: "Folder",
    hasChildren: false,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Concept", "@id": "http://endhealth.info/im#Concept" }
    ],
    "@id": "http://endhealth.info/im#Folder"
  },
  {
    name: "Node shape",
    hasChildren: false,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://www.w3.org/ns/shacl#NodeShape"
  },
  {
    name: "ObjectProperty",
    hasChildren: true,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://www.w3.org/2002/07/owl#ObjectProperty"
  },
  {
    name: "Property",
    hasChildren: true,
    type: [
      { name: "Organisation  (record type)", "@id": "http://endhealth.info/im#Organisation" },
      { name: "Class", "@id": "http://www.w3.org/2000/01/rdf-schema#Class" }
    ],
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
  },
  {
    name: "Query template",
    hasChildren: false,
    type: [
      { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
      { name: "Concept", "@id": "http://endhealth.info/im#Concept" }
    ],
    "@id": "http://endhealth.info/im#QueryTemplate"
  },
  {
    name: "Value set",
    hasChildren: false,
    type: [
      { name: "Concept", "@id": "http://endhealth.info/im#Concept" },
      { name: "Organisation  (record type)", "@id": "http://endhealth.info/im#Organisation" }
    ],
    "@id": "http://endhealth.info/im#ValueSet"
  }
];

describe("HierarchyFilter.vue ___ empty store", () => {
  let wrapper;
  let mockStore;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockStore = { state: { filterOptions: {}, hierarchySelectedFilters: [] }, commit: jest.fn() };

    ConfigService.getFilterDefaults = jest.fn().mockResolvedValue(CONFIG);

    EntityService.getNamespaces = jest.fn().mockResolvedValue(NAMESPACES);

    EntityService.getEntityChildren = jest
      .fn()
      .mockResolvedValueOnce(STATUS)
      .mockResolvedValueOnce(TYPES);

    const warn = console.warn;
    console.warn = jest.fn();

    wrapper = shallowMount(HierarchyFilter, { global: { components: { Button, MultiSelect }, mocks: { $store: mockStore } } });

    console.warn = warn;
    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.statusOptions).toStrictEqual(STATUS);
    expect(wrapper.vm.schemeOptions).toStrictEqual(NAMESPACES);
    expect(wrapper.vm.typeOptions).toStrictEqual(TYPES);
    expect(wrapper.vm.selectedSchemes).toStrictEqual([
      { iri: "http://endhealth.info/im#", prefix: "im", name: "Discovery namespace" },
      { iri: "http://snomed.info/sct#", prefix: "sn", name: "Snomed-CT namespace" }
    ]);
    expect(wrapper.vm.configs).toStrictEqual(CONFIG);
  });

  it("inits", async () => {
    wrapper.vm.setDefaults = jest.fn();
    wrapper.vm.getFilterOptions = jest.fn();
    wrapper.vm.setFilters = jest.fn();
    wrapper.vm.init();
    await flushPromises();
    expect(wrapper.vm.getFilterOptions).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.setFilters).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.setDefaults).toHaveBeenCalledTimes(1);
  });

  it("can setFilters", () => {
    wrapper.vm.setFilters();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateFilterOptions", { schemes: NAMESPACES, types: TYPES, status: STATUS });
  });

  it("can setDefaults", () => {
    wrapper.vm.resetFilters = jest.fn();
    wrapper.vm.setDefaults();
    expect(wrapper.vm.resetFilters).toHaveBeenCalledTimes(1);
  });

  it("can updateStoreSelectedFilters", () => {
    wrapper.vm.updateStoreSelectedFilters();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateHierarchySelectedFilters", [
      { iri: "http://endhealth.info/im#", name: "Discovery namespace", prefix: "im" },
      { iri: "http://snomed.info/sct#", name: "Snomed-CT namespace", prefix: "sn" }
    ]);
  });

  it("can getConfigs", async () => {
    wrapper.vm.getConfigs();
    await flushPromises();
    expect(ConfigService.getFilterDefaults).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.configs).toStrictEqual(CONFIG);
  });

  it("can getFilterOptions", async () => {
    EntityService.getEntityChildren = jest
      .fn()
      .mockResolvedValueOnce(STATUS)
      .mockResolvedValueOnce(TYPES);
    wrapper.vm.getConfigs = jest.fn();
    wrapper.vm.getFilterOptions();
    await flushPromises();
    expect(wrapper.vm.getConfigs).toHaveBeenCalledTimes(1);
    expect(EntityService.getNamespaces).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityChildren).toHaveBeenNthCalledWith(1, IM.STATUS);
    expect(EntityService.getEntityChildren).toHaveBeenLastCalledWith(IM.MODELLING_ENTITY_TYPE);
    expect(wrapper.vm.schemeOptions).toStrictEqual(NAMESPACES);
    expect(wrapper.vm.statusOptions).toStrictEqual(STATUS);
    expect(wrapper.vm.typeOptions).toStrictEqual(TYPES);
  });

  it("can resetFilters", () => {
    wrapper.vm.selectedSchemes = [];
    wrapper.vm.updateStoreSelectedFilters = jest.fn();
    wrapper.vm.resetFilters();
    expect(wrapper.vm.selectedSchemes).toStrictEqual([
      {
        iri: "http://endhealth.info/im#",
        name: "Discovery namespace",
        prefix: "im"
      },
      {
        iri: "http://snomed.info/sct#",
        name: "Snomed-CT namespace",
        prefix: "sn"
      }
    ]);
    expect(wrapper.vm.updateStoreSelectedFilters).toHaveBeenCalledTimes(1);
  });
});

describe("HierarchyFilter.vue ___ full store", () => {
  let wrapper;
  let mockStore;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockStore = {
      state: {
        filterOptions: { status: STATUS, types: TYPES, schemes: NAMESPACES },
        hierarchySelectedFilters: [
          {
            iri: "http://endhealth.info/im#",
            name: "Discovery namespace",
            prefix: "im"
          }
        ]
      },
      commit: jest.fn()
    };

    ConfigService.getFilterDefaults = jest.fn().mockResolvedValue(CONFIG);

    EntityService.getNamespaces = jest.fn().mockResolvedValue(NAMESPACES);

    EntityService.getEntityChildren = jest
      .fn()
      .mockResolvedValueOnce(STATUS)
      .mockResolvedValueOnce(TYPES);

    const warn = console.warn;
    console.warn = jest.fn();

    wrapper = shallowMount(HierarchyFilter, { global: { components: { Button, MultiSelect }, mocks: { $store: mockStore } } });

    console.warn = warn;
    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.statusOptions).toStrictEqual([]);
    expect(wrapper.vm.schemeOptions).toStrictEqual(NAMESPACES);
    expect(wrapper.vm.typeOptions).toStrictEqual([]);
    expect(wrapper.vm.selectedSchemes).toStrictEqual([{ iri: "http://endhealth.info/im#", prefix: "im", name: "Discovery namespace" }]);
    expect(wrapper.vm.configs).toStrictEqual(CONFIG);
  });

  it("inits", async () => {
    wrapper.vm.setDefaults = jest.fn();
    wrapper.vm.getFilterOptions = jest.fn();
    wrapper.vm.setFilters = jest.fn();
    wrapper.vm.getConfigs = jest.fn();
    wrapper.vm.init();
    await flushPromises();
    expect(wrapper.vm.getFilterOptions).not.toHaveBeenCalled();
    expect(wrapper.vm.setFilters).not.toHaveBeenCalled();
    expect(wrapper.vm.getConfigs).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.schemeOptions).toStrictEqual(NAMESPACES);
    expect(wrapper.vm.setDefaults).toHaveBeenCalledTimes(1);
  });

  it("can setDefaults", () => {
    wrapper.vm.resetFilters = jest.fn();
    wrapper.vm.setDefaults();
    expect(wrapper.vm.resetFilters).not.toHaveBeenCalled();
    expect(wrapper.vm.selectedSchemes).toStrictEqual([
      {
        iri: "http://endhealth.info/im#",
        name: "Discovery namespace",
        prefix: "im"
      }
    ]);
  });
});
