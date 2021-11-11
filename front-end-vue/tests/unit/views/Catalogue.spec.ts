import { flushPromises, shallowMount } from "@vue/test-utils";
import Catalogue from "@/views/Catalogue.vue";
import CatalogueService from "@/services/CatalogueService";

describe("Catalogue.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockStore: any;

  const INSTANCE = {
    entity: {
      "@id": "http://org.endhealth.info/im#FQK48",
      "http://endhealth.info/im#address": {
        "@id": "http://loc.endhealth.info/im#FQK48"
      },
      "http://endhealth.info/im#status": {
        "@id": "http://endhealth.info/im#Active",
        name: "Active"
      },
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "@id": "http://endhealth.info/im#Organisation",
        name: "Organisation  (record type)"
      },
      "http://www.w3.org/2000/01/rdf-schema#label": "EDWALTON PHARMACY"
    },
    predicates: [
      { name: "address", "@id": "http://endhealth.info/im#address" },
      { name: "status", "@id": "http://endhealth.info/im#status" },
      { name: "type", "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
      { name: "label", "@id": "http://www.w3.org/2000/01/rdf-schema#label" }
    ]
  };

  const TYPES = [
    { iri: "http://endhealth.info/im#Organisation", label: "Organisation (record type)", count: 267904 },
    { iri: "http://endhealth.info/im#Address", label: "Address (record type)", count: 267904 }
  ];

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn()
    };

    mockStore = {
      state: {
        instanceIri: "http://org.endhealth.info/im#FQK48"
      },
      commit: jest.fn()
    };

    CatalogueService.getPartialInstance = jest.fn().mockResolvedValue(INSTANCE);

    CatalogueService.getTypesCount = jest.fn().mockResolvedValue(TYPES);

    wrapper = shallowMount(Catalogue, {
      global: {
        components: {},
        mocks: { $router: mockRouter, $store: mockStore }
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("mounts with correct data", async () => {
    expect(wrapper.vm.types).toStrictEqual(TYPES);
    expect(wrapper.vm.instance).toStrictEqual(INSTANCE);
    expect(wrapper.vm.history).toStrictEqual([]);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("displayInstance on iri change", async () => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.instanceIri.call(wrapper.vm, "http://org.endhealth.info/im#FQK4");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
  });
});
