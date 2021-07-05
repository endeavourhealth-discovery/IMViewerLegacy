import { shallowMount } from "@vue/test-utils";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Column from "primevue/column";
import OverlayPanel from "primevue/overlaypanel";
import Tooltip from "primevue/tooltip";
import ContextMenu from "primevue/contextmenu";
import VueClipboard from "vue3-clipboard";
import Button from "primevue/button";
import LoggerService from "@/services/LoggerService";

describe("SearchResults.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockRouter = {
      push: jest.fn()
    }
    mockStore = {
      state: {
        loading: {
          get: jest.fn().mockReturnValue(false)
        },
        searchResults: [{
          "name":"Scoliosis deformity of spine (disorder)",
          "iri":"http://snomed.info/sct#298382003",
          "code":"298382003",
          "status":{"name":"Active","@id":"http://endhealth.info/im#Active"},
          "scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},
          "entityType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],
          "isDescendentOf":[],
          "weighting":0,
          "match":"Scoliosis"
        }]
      }
    };
    mockToast = {
      add: jest.fn()
    }

    wrapper = shallowMount(SearchResults, {
      global: {
        components: { DataTable, ProgressSpinner, Column, OverlayPanel, ContextMenu, Button },
        mocks: { $store: mockStore, $router: mockRouter, $toast: mockToast },
        directives: { "tooltip": Tooltip, "clipboard": VueClipboard }
      }
    });
  });

  it("starts empty", () => {
    expect(wrapper.vm.results).toEqual({});
    expect(wrapper.vm.selectedResult).toStrictEqual({});
    expect(wrapper.vm.hoveredResult).toStrictEqual({});
  });

  it("can get perspective by concept type", () => {
    const testConceptType = [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}];
    expect(wrapper.vm.getPerspectiveByConceptType(testConceptType)).toBe("far fa-fw fa-lightbulb")
  });

  it("can get colour by concept type", () => {
    const testConceptType = [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}];
    expect(wrapper.vm.getColorByConceptType(testConceptType)).toBe("color:#e39a3688")
  });

  it("reroutes on node select", async() => {
    wrapper.vm.selectedResult = {
      "name":"Scoliosis deformity of spine (disorder)",
      "iri":"http://snomed.info/sct#298382003",
      "code":"298382003",
      "status":{"name":"Active","@id":"http://endhealth.info/im#Active"},
      "scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},
      "conceptType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],
      "isDescendentOf":[],
      "weighting":0,
      "match":"Scoliosis"
    };
    await wrapper.vm.$nextTick();
    wrapper.vm.onNodeSelect();
    await wrapper.vm.$nextTick();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "Concept",
      params: { selectedIri: "http://snomed.info/sct#298382003"}
    });
  });

  it("can get concept types from concept", () => {
    const testConcept = {
      "name":"Scoliosis deformity of spine (disorder)",
      "iri":"http://snomed.info/sct#298382003",
      "code":"298382003",
      "status":{"name":"Active","@id":"http://endhealth.info/im#Active"},
      "scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},
      "entityType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}, {"name":"Instance","@id":""}],
      "isDescendentOf":[],
      "weighting":0,
      "match":"Scoliosis"
    };
    expect(wrapper.vm.getConceptTypes(testConcept)).toBe("Class, Instance");
  });

  it("updates results on store update", async() => {
    const testResult = {"name":"Acquired scoliosis (disorder)","iri":"http://snomed.info/sct#111266001","code":"111266001","status":{"name":"Active","@id":"http://endhealth.info/im#Active"},"scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"conceptType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isDescendentOf":[],"weighting":9,"match":"Acquired scoliosis"};
    wrapper.vm.$options.watch.searchResults.call(wrapper.vm, testResult);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.results).toStrictEqual(testResult);
  });

  it("can create copy return object", () => {
    const testData = {"name":"Scoliosis deformity of spine (disorder)","iri":"http://snomed.info/sct#298382003","code":"298382003","status":{"name":"Active","@id":"http://endhealth.info/im#Active"},"scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isDescendentOf":[],"weighting":0,"match":"Scoliosis"};
    const returnData = wrapper.vm.copyConceptToClipboard(testData);
    expect(returnData).toEqual("Name: Scoliosis deformity of spine (disorder), Iri: http://snomed.info/sct#298382003, Code: 298382003, Status: Active, Scheme: Snomed-CT code, Type: Class");
  });

  it("can fire toast on copy", () => {
    wrapper.vm.onCopy();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Value copied to clipboard"));
  });

  it("can fire toast on copy error", () => {
    wrapper.vm.onCopyError();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to copy value to clipboard"));
  });

  it("can set copy menu items", () => {
    wrapper.vm.hoveredResult = {"name":"Scoliosis deformity of spine (disorder)","iri":"http://snomed.info/sct#298382003","code":"298382003","status":{"name":"Active","@id":"http://endhealth.info/im#Active"},"scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isDescendentOf":[],"weighting":0,"match":"Scoliosis"}
    wrapper.vm.copyMenuItems = [];
    expect(wrapper.vm.copyMenuItems).toStrictEqual([]);
    wrapper.vm.setCopyMenuItems();
    expect(wrapper.vm.copyMenuItems).toHaveLength(9);
  })
});
