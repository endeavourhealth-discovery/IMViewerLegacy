import { flushPromises, shallowMount } from "@vue/test-utils";
import UsedIn from "@/components/concept/UsedIn.vue";
import ProgressSpinner from "primevue/progressspinner";
import Listbox from "primevue/listbox";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("UsedIn.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let docSpy: any;

  beforeEach(() => {
    jest.resetAllMocks();
    EntityService.getEntityUsages = jest.fn().mockResolvedValue({data: [{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]});
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    wrapper = shallowMount(UsedIn, {
      global: {
        components: { ProgressSpinner, Listbox },
        mocks: { $router: mockRouter, $toast: mockToast }
      },
      props: { conceptIri: "http://snomed.info/sct#298382003" }
    });
  });

  it("starts with empty values", () => {
    expect(wrapper.vm.selectedUsage).toStrictEqual({});
    expect(wrapper.vm.usages).toStrictEqual([{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.listHeight).toBe("");
  });

  it("adds event listener to setListboxHeight on resize", async() => {
    await flushPromises();
    const spy = jest.spyOn(wrapper.vm, "setListboxHeight");
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

  it("can setListboxHeight ___ fail", () => {
    LoggerService.error = jest.fn();
    wrapper.vm.setListboxHeight();
    expect(LoggerService.error).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenCalledWith("Failed to set UsedIn listbox height");
    expect(wrapper.vm.listHeight).toBe("");
  });

  it("sets listBox height ___ container success", async() => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ height: 100 })
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setListboxHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.listHeight).not.toBe("");
    docSpy.mockReset();
    jest.clearAllMocks();
  });

  it("getsUsages on iri change", async() => {
    wrapper.vm.getUsages = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getUsages).toHaveBeenCalledTimes(1);
  });

  it("resizes", () => {
    wrapper.vm.setListboxHeight = jest.fn();
    wrapper.vm.resize();
    expect(wrapper.vm.setListboxHeight).toHaveBeenCalledTimes(1);
  });

  it("gets usages", async() => {
    wrapper.vm.getUsages();
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    expect(EntityService.getEntityUsages).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityUsages).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.usages).toStrictEqual([{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("gets usages ___ fetch error", async() => {
    wrapper.vm.usages = [];
    EntityService.getEntityUsages = jest.fn().mockRejectedValue({ code: 403, message: "Test error"});
    wrapper.vm.getUsages("http://snomed.info/sct#298382003");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    expect(EntityService.getEntityUsages).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityUsages).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.usages).toStrictEqual([]);
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get usages from server", "Test error"));
    expect(wrapper.vm.loading).toBe(false);
  });

  it("handles nodeSelect", () => {
    wrapper.vm.onNodeSelect({ "@id": "http://endhealth.info/im#test" });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "Concept",
      params: { selectedIri: "http://endhealth.info/im#test" }
    });
  })
});

describe("UsedIn.vue ___ no iri", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let docSpy: any;

  beforeEach(() => {
    jest.resetAllMocks();
    EntityService.getEntityUsages = jest.fn().mockResolvedValue({data: []});
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    wrapper = shallowMount(UsedIn, {
      global: {
        components: { ProgressSpinner, Listbox },
        mocks: { $router: mockRouter, $toast: mockToast }
      },
      props: { conceptIri: "" }
    });
  });

  it("doesnt getUsages", () => {
    expect(EntityService.getEntityUsages).not.toHaveBeenCalled();
  });

});
