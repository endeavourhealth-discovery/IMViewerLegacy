import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import SidebarControl from "@/components/home/SidebarControl.vue";
import SideNav from "@/components/home/SideNav.vue";
import Swal from "sweetalert2";
import { User } from "@/models/user/User";
import LoggerService from "@/services/LoggerService";

describe("Home.vue ___ route = Home", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let testUser: User;
  let mockToast: any;
  let mockRoute: any;

  beforeEach(() => {
    testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "colour/003-man.png" });
    testUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");
    Swal.fire = jest.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }));
    mockStore = {
      state: {
        conceptIri: "test Iri",
        sideNavHierarchyFocus: {
          name: "Ontology",
          iri: "http://endhealth.info/im#DiscoveryOntology"
        }
      },
      commit: jest.fn(),
      dispatch: jest.fn().mockResolvedValue(true)
    }
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    mockRoute = {
      params: {selectedIri: "test Iri" },
      name: "Home"
    };
    mockToast = { add: jest.fn() };
    wrapper = shallowMount(Home, {
      global: {
        components: { SidebarControl, SideNav },
        mocks: { $router: mockRouter, $route: mockRoute, $toast: mockToast, $store: mockStore },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("should dispatch store authenticated user on mount", () => {
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toBeCalledWith("authenticateCurrentUser");
  });

  it("should updateRoute ___ Home ___ Ontology", async() => {
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toBeCalledWith(
      "updateConceptIri",
      "http://endhealth.info/im#DiscoveryOntology"
    );
    expect(mockStore.dispatch).toBeCalledTimes(1);
  });

  it("should updateRoute ___ Home ___ InformationModel", async() => {
    mockStore.state.sideNavHierarchyFocus = { name: "InformationModel", iri: "http://endhealth.info/im#InformationModel"};
    await wrapper.vm.$nextTick();
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toBeCalledWith(
      "updateConceptIri",
      "http://endhealth.info/im#DiscoveryOntology"
    );
    expect(mockStore.dispatch).toBeCalledTimes(1);
  });
});

describe("Home.vue ___ route = Concept", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let testUser: User;
  let mockToast: any;
  let mockRoute: any;

  beforeEach(() => {
    testUser = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "colour/003-man.png" });
    testUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09");
    Swal.fire = jest.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }));
    mockStore = {
      state: { conceptIri: "test Iri", sideNavHierarchyFocus: {name: "Ontology", iri: "http://endhealth.info/im#DiscoveryOntology" } },
      commit: jest.fn(),
      dispatch: jest.fn().mockResolvedValue(true)
    }
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    mockRoute = {
      params: {selectedIri: "test concept Iri" },
      name: "Concept"
    };
    mockToast = { add: jest.fn() };
    wrapper = shallowMount(Home, {
      global: {
        components: { SidebarControl, SideNav },
        mocks: { $router: mockRouter, $route: mockRoute, $toast: mockToast, $store: mockStore },
        stubs: ["router-link", "router-view"],
      },
    });
  });

  it("should updateRoute ___ Concept", async() => {
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toBeCalledWith(
      "updateConceptIri",
      "test concept Iri"
    );
    expect(mockStore.dispatch).toBeCalledTimes(1);
  });
});
