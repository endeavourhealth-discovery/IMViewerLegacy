import { shallowMount } from "@vue/test-utils";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Column from "primevue/column";
import OverlayPanel from "primevue/overlaypanel";
import * as ConceptTypeMethods from "@/helpers/ConceptTypeMethods";

describe("SearchResults.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;

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
          "conceptType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],
          "isDescendentOf":[],
          "weighting":0,
          "match":"Scoliosis"
        }]
      }
    };

    wrapper = shallowMount(SearchResults, {
      global: {
        components: { DataTable, ProgressSpinner, Column, OverlayPanel },
        mocks: { $store: mockStore, $router: mockRouter }
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
    expect(wrapper.vm.getColorByConceptType(testConceptType)).toBe("color:#dbab3b88")
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
      "conceptType":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}, {"name":"Instance","@id":""}],
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
});
