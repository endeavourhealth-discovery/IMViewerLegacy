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
      state: { conceptIri: "test Iri" },
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
    expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
    expect(mockStore.dispatch).toBeCalledWith("authenticateCurrentUser");
  });

  it("should updateRoute ___ Home", async() => {
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toBeCalledWith(
      "updateConceptIri",
      "http://endhealth.info/im#DiscoveryOntology"
    );
    expect(mockStore.dispatch).toBeCalledTimes(3);
    expect(mockStore.dispatch).toBeCalledWith("fetchConceptAggregate", "test Iri");
  });

  it("should updateRoute ___ Concept", async() => {
    mockRoute.name = "Concept";
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toBeCalledWith(
      "updateConceptIri",
      "test Iri"
    );
    expect(mockStore.dispatch).toBeCalledTimes(3);
    expect(mockStore.dispatch).toBeCalledWith("fetchConceptAggregate", "test Iri");
  });

  it("should fire toast message on failed store dispatch", async() => {
    mockStore.dispatch = jest.fn().mockResolvedValue(false);
    wrapper.vm.updateRoute();
    await wrapper.vm.$nextTick();
    expect(mockToast.add).toBeCalledTimes(1);
    expect(mockToast.add).toBeCalledWith(
      LoggerService.error("Concept aggregate server request failed")
    );
  });
});

