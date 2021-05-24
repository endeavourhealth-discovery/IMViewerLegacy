import { shallowMount } from "@vue/test-utils";
import SidebarControl from "@/components/home/SidebarControl.vue";
import InputText from "primevue/inputtext";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import Filters from "@/components/sidebar/Filters.vue";

describe("SidebarControl.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;
  let testError: Error;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      state: {
        filters: {
          selectedStatus: ["Active", "Draft"],
          selectedSchemes: [
            {
              iri: "http://endhealth.info/im#DiscoveryCodeScheme",
              name: "Discovery code"
            },
            {
              iri: "http://endhealth.info/im#SnomedCodeScheme",
              name: "Snomed-CT code"
            },
            {
              iri: "http://endhealth.info/im#TermOnlyCodeScheme",
              name: "Term based code"
            }
          ]
        }
      },
      commit: jest.fn(),
      dispatch: jest.fn().mockResolvedValue(true)
    };
    mockToast = {
      add: jest.fn()
    };
    wrapper = shallowMount(SidebarControl, {
      global: {
        components: { InputText, TabPanel, TabView, Hierarchy, History, SearchResults, Filters },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    });
  });

  it("adds event listener to setsContainerHeights on resize", async() => {
    const spy1 = jest.spyOn(wrapper.vm, "setContainerHeights");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy1).toHaveBeenCalledTimes(1);
    spy1.mockReset();
  });

  it("only searches with 3 or more characters ___ 0", async() => {
    wrapper.vm.searchTerm = "";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(0);
    expect(mockStore.commit).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it("only searches with 3 or more characters ___ 2", async() => {
    wrapper.vm.searchTerm = "we";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(0);
    expect(mockStore.commit).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it("only searches with 3 or more characters ___ 2", async() => {
    wrapper.vm.searchTerm = "sco";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(2);
    expect(mockStore.commit).toHaveBeenCalled();
  });
});
