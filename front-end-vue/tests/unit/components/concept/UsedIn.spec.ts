import { flushPromises, shallowMount } from "@vue/test-utils";
import UsedIn from "@/components/concept/UsedIn.vue";
import ProgressSpinner from "primevue/progressspinner";
import Listbox from "primevue/listbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("UsedIn.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let docSpy: any;

  beforeEach(async() => {
    jest.resetAllMocks();
    EntityService.getEntityUsages = jest.fn().mockResolvedValue({data: [{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]});
    EntityService.getUsagesTotalRecords = jest.fn().mockResolvedValue({ data: 50 });
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    const warn = console.warn;
    console.warn = jest.fn();

    const error = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(UsedIn, {
      global: {
        components: { ProgressSpinner, Listbox, DataTable, Column },
        mocks: { $router: mockRouter, $toast: mockToast }
      },
      props: { conceptIri: "http://snomed.info/sct#298382003" }
    });

    await flushPromises();
    jest.clearAllMocks();

    console.warn = warn;
    console.error = error;
  });

  it("starts with empty values", () => {
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.usages).toStrictEqual([{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.records).toBe(50);
    expect(wrapper.vm.currentPage).toBe(1);
    expect(wrapper.vm.pageSize).toBe(25);
    expect(wrapper.vm.scrollHeight).toBe("500px");
  });

  it("getsUsages on iri change", async() => {
    wrapper.vm.getUsages = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.getUsages).toHaveBeenCalledTimes(1);
  });

  it("gets usages", async() => {
    wrapper.vm.getUsages("http://snomed.info/sct#298382003", 0, 25);
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    expect(EntityService.getEntityUsages).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityUsages).toHaveBeenCalledWith("http://snomed.info/sct#298382003",0,25);
    expect(wrapper.vm.usages).toStrictEqual([{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Anterior vertebral body tethering (procedure)","@id":"http://snomed.info/sct#788325009"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Family history of scoliosis deformity of spine (situation)","@id":"http://snomed.info/sct#430544007"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"}]);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("gets usages ___ fetch error", async() => {
    wrapper.vm.usages = [];
    EntityService.getEntityUsages = jest.fn().mockRejectedValue(false);
    wrapper.vm.getUsages("http://snomed.info/sct#298382003", 0, 25);
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    expect(EntityService.getEntityUsages).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityUsages).toHaveBeenCalledWith("http://snomed.info/sct#298382003", 0, 25);
    expect(wrapper.vm.usages).toStrictEqual([]);
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get usages from server"));
    expect(wrapper.vm.loading).toBe(false);
  });
});

describe("UsedIn.vue ___ no iri", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
    EntityService.getEntityUsages = jest.fn().mockResolvedValue({data: []});
    EntityService.getUsagesTotalRecords = jest.fn().mockResolvedValue({ data: 0 });
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };

    const warn = console.warn;
    console.warn = jest.fn();

    const error = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(UsedIn, {
      global: {
        components: { ProgressSpinner, Listbox, DataTable, Column },
        mocks: { $router: mockRouter, $toast: mockToast }
      },
      props: { conceptIri: "" }
    });

    console.warn = warn;
    console.error = error;
  });

  it("doesnt getUsages", async() => {
    await flushPromises();
    expect(EntityService.getEntityUsages).not.toHaveBeenCalled();
  });
});
