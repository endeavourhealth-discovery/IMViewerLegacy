import Properties from "@/components/concept/Properties.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("Properties.vue", () => {
  let wrapper;
  let mockRouter;
  let docSpy;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockRouter = {
      push: jest.fn()
    };

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    EntityService.getDataModelProperties = jest.fn().mockResolvedValue([
      {
        property: {
          name: "manufacturer",
          "@id": "http://endhealth.info/im#manufacturer"
        },
        type: {
          name: "Concept",
          "@id": "http://endhealth.info/im#Concept"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "reaction",
          "@id": "http://endhealth.info/im#reaction"
        },
        type: {
          name: "Concept",
          "@id": "http://endhealth.info/im#Concept"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "vaccination procedure",
          "@id": "http://endhealth.info/im#vaccinationProcedure"
        },
        type: {
          name: "Value set Immunisations - Care connect",
          "@id": "http://endhealth.info/im#VSET_Immunisations_CareConnect"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "vaccine product",
          "@id": "http://endhealth.info/im#vaccineProduct"
        },
        type: {
          name: "Concept",
          "@id": "http://endhealth.info/im#Concept"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "batch number",
          "@id": "http://endhealth.info/im#batchNumber"
        },
        type: {
          "@id": "http://www.w3.org/2001/XMLSchema#string"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "dose sequence",
          "@id": "http://endhealth.info/im#doseSequence"
        },
        type: {
          "@id": "http://www.w3.org/2001/XMLSchema#string"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "doses required",
          "@id": "http://endhealth.info/im#dosesRequired"
        },
        type: {
          "@id": "http://www.w3.org/2001/XMLSchema#string"
        },
        inheritedFrom: {}
      },
      {
        property: {
          name: "expiry date",
          "@id": "http://endhealth.info/im#expiryDate"
        },
        type: {
          "@id": "http://www.w3.org/2001/XMLSchema#string"
        },
        inheritedFrom: {}
      }
    ]);

    wrapper = shallowMount(Properties, {
      global: {
        components: { DataTable, Column, Button },
        mocks: { $router: mockRouter }
      },
      props: { conceptIri: "http://endhealth.info/im#Immunisation" }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("adds event listener to setScrollHeight on resize", async () => {
    const spy = jest.spyOn(wrapper.vm, "setScrollHeight");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it("can remove eventListener", () => {
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });

  it("sets scrollHeight ___ container fail", async () => {
    LoggerService.error = jest.fn();
    wrapper.vm.setScrollHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.scrollHeight).toBe("500px");
    expect(LoggerService.error).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenCalledWith(undefined, "Failed to set Properties table scroll height. Required elements not found.");
  });

  it("sets scrollHeight ___ container success", async () => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ height: 100 });
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setScrollHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.scrollHeight).not.toBe("500px");
    docSpy.mockReset();
    jest.clearAllMocks();
  });

  it("getsDataModelProps on conceptIri change", async () => {
    wrapper.vm.getDataModelProps = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getDataModelProps).toHaveBeenCalledTimes(1);
  });

  it("can resize", () => {
    wrapper.vm.setScrollHeight = jest.fn();
    wrapper.vm.onResize();
    expect(wrapper.vm.setScrollHeight).toHaveBeenCalledTimes(1);
  });
});
