import { flushPromises, shallowMount } from "@vue/test-utils";
import ComplexMappings from "@/components/concept/ComplexMappings.vue";
import ProgressSpinner from "primevue/progressspinner";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import EntityService from "@/services/EntityService";

describe("ComplexMappings.vue", () => {
  let wrapper: any;
  let mockStore: any;

  beforeEach(async() => {
    jest.resetAllMocks();
    mockStore = {
      state: { loading: { get: jest.fn().mockReturnValue(false) }},
      commit: jest.fn()
    };

    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ data: { "http://endhealth.info/im#hasMap": [{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}]}});

    wrapper = shallowMount(ComplexMappings, {
      global: {
        components: { ProgressSpinner, OrganizationChart, OverlayPanel },
        mocks: { $store: mockStore }
      },
      props: { conceptIri: "http://snomed.info/sct#723312009" }
    });
    await flushPromises();
    jest.clearAllMocks();
  });

  it("watches conceptIri", async() => {
    wrapper.vm.getMappings = jest.fn().mockResolvedValue(true);
    wrapper.vm.createChartStructure = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#723312009");
    expect(wrapper.vm.getMappings).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.vm.createChartStructure).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", {
      key: "mappings",
      value: true
    });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "mappings",
      value: false
    });
  });

  it("can get mappings ___ success", async() => {
    wrapper.vm.getMappings();
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#723312009", ["http://endhealth.info/im#hasMap"]);
    expect(wrapper.vm.mappings).toStrictEqual([{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}]);
  });

  it("can get mappings ___ fail", async() => {
    EntityService.getPartialEntity = jest.fn().mockRejectedValue(false);
    wrapper.vm.getMappings();
    await flushPromises();
    expect(wrapper.vm.mappings).toStrictEqual([]);
    expect(wrapper.vm.data).toStrictEqual({});
  });
});
