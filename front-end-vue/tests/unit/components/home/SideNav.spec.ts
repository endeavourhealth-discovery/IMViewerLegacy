import { flushPromises, shallowMount } from "@vue/test-utils";
import SideNav from "@/components/home/SideNav.vue";
import Menu from "primevue/menu";
import { User } from "@/models/user/User";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { IM } from "@/vocabulary/IM";

describe("SideNav.spec ___ not logged in", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(async () => {
    mockStore = {
      state: {
        currentUser: null,
        isLoggedIn: false,
        sideNavHierarchyFocus: { name: "Ontology", iri: "http://endhealth.info/im#DiscoveryOntology" },
        selectedEntityType: "Class",
        moduleSelectedEntities: new Map([
          ["Ontology", IM.MODULE_ONTOLOGY],
          ["Sets", IM.MODULE_SETS],
          ["DataModel", IM.MODULE_DATA_MODEL],
          ["Catalogue", IM.MODULE_CATALOGUE],
          ["Queries", IM.MODULE_QUERIES]
        ]),
        focusHierarchy: false
      },
      commit: jest.fn()
    };
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    };
    mockRoute = {
      params: { selectedIri: "test Iri" },
      name: "Home"
    };
    wrapper = shallowMount(SideNav, {
      global: {
        components: { Menu, FontAwesomeIcon },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter }
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("starts with the correct data", () => {
    expect(wrapper.vm.userPopupBottom).toBe(0);
    expect(wrapper.vm.loginItems).toStrictEqual([
      {
        label: "Login",
        icon: "fa fa-fw fa-user",
        to: "/user/login"
      },
      {
        label: "Register",
        icon: "fa fa-fw fa-user-plus",
        to: "/user/register"
      }
    ]);
    expect(wrapper.vm.accountItems).toStrictEqual([
      {
        label: "My account",
        icon: "fa fa-fw fa-user",
        to: "/user/my-account" //+ this.user.id
      },
      {
        label: "Edit account",
        icon: "fa fa-fw fa-user-edit",
        to: "/user/my-account/edit"
      },
      {
        label: "Change password",
        icon: "fa fa-fw fa-user-lock",
        to: "/user/my-account/password-edit"
      },
      {
        label: "Logout",
        icon: "fa fa-fw fa-sign-out-alt",
        to: "/user/logout" //+ this.user.id
      }
    ]);
  });

  it("can determine isActive ___ true", () => {
    expect(wrapper.vm.isActive("Ontology")).toBeTruthy();
  });

  it("can determine isActive ___ false", () => {
    expect(wrapper.vm.isActive("Concept")).toBeFalsy();
  });

  it("can getItems ___ not logged in", () => {
    expect(wrapper.vm.getItems()).toStrictEqual([
      {
        label: "Login",
        icon: "fa fa-fw fa-user",
        to: "/user/login"
      },
      {
        label: "Register",
        icon: "fa fa-fw fa-user-plus",
        to: "/user/register"
      }
    ]);
  });

  it("returns the correct image url", async () => {
    jest.mock("@/assets/avatars/colour/013-woman.png", () => {
      return "/img/013-woman.7f32b854.png";
    });
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toBe("/img/013-woman.7f32b854.png");
  });

  it("can reset to home", async () => {
    wrapper.vm.handleCenterIconClick = jest.fn();
    wrapper.vm.resetToHome();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenCalledTimes(5);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateModuleSelectedEntities", {
      iri: "http://endhealth.info/im#DiscoveryOntology",
      module: "Ontology"
    });
    expect(mockStore.commit).toHaveBeenNthCalledWith(2, "updateModuleSelectedEntities", { iri: "http://endhealth.info/im#Sets", module: "Sets" });
    expect(mockStore.commit).toHaveBeenNthCalledWith(3, "updateModuleSelectedEntities", {
      iri: "http://endhealth.info/im#DiscoveryCommonDataModel",
      module: "DataModel"
    });
    expect(mockStore.commit).toHaveBeenNthCalledWith(4, "updateModuleSelectedEntities", {
      iri: "http://endhealth.info/im#QT_QueryTemplates",
      module: "Queries"
    });
    await flushPromises();
    expect(wrapper.vm.handleCenterIconClick).toHaveBeenCalled();
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateResetTree", true);
  });

  it("can handleCenterIconClick", async () => {
    wrapper.vm.handleCenterIconClick({
      name: "Ontology",
      iri: "http://endhealth.info/im#Discoveryontology",
      fullName: "Ontologies",
      route: "Dashboard"
    });
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateSideNavHierarchyFocus", {
      name: "Ontology",
      fullName: "Ontologies",
      iri: "http://endhealth.info/im#Discoveryontology",
      route: "Dashboard"
    });
    expect(mockStore.commit).toHaveBeenNthCalledWith(2, "updateConceptIri", "http://endhealth.info/im#DiscoveryOntology");
    expect(mockStore.commit).toHaveBeenNthCalledWith(3, "updateActiveModule", "Ontology");
    expect(mockStore.commit).toHaveBeenNthCalledWith(4, "updateFocusHierarchy", true);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
  });

  it("can handleCenterIconClick ___ not entityFocus", async () => {
    wrapper.vm.handleCenterIconClick({ name: "Workflow", route: "Workflow" });
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).not.toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Workflow" });
  });

  it("can watch selectedEntityType ___ Ontology", async () => {
    wrapper.vm.$options.watch.selectedEntityType.call(wrapper.vm, "Ontology");
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateSideNavHierarchyFocus", {
      fullName: "Ontologies",
      iri: "http://endhealth.info/im#DiscoveryOntology",
      name: "Ontology",
      route: "Dashboard"
    });
  });

  it("can watch selectedEntityType ___ Sets", async () => {
    wrapper.vm.$options.watch.selectedEntityType.call(wrapper.vm, "Sets");
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateSideNavHierarchyFocus", {
      fullName: "Concept sets and value sets",
      iri: "http://endhealth.info/im#Sets",
      name: "Sets",
      route: "Dashboard"
    });
  });

  it("can watch selectedEntityType ___ Queries", async () => {
    wrapper.vm.$options.watch.selectedEntityType.call(wrapper.vm, "Queries");
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateSideNavHierarchyFocus", {
      fullName: "Query templates",
      iri: "http://endhealth.info/im#QT_QueryTemplates",
      name: "Queries",
      route: "Dashboard"
    });
  });
});

describe("SideNav.spec ___ logged in", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(() => {
    mockStore = {
      state: {
        currentUser: new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "12345678", "colour/001-man.png"),
        isLoggedIn: true,
        sideNavHierarchyFocus: { name: "Ontology", iri: "http://endhealth.info/im#DiscoveryOntology" },
        selectedEntityType: "Class",
        moduleSelectedEntities: new Map([
          ["Ontology", IM.MODULE_ONTOLOGY],
          ["Sets", IM.MODULE_SETS],
          ["DataModel", IM.MODULE_DATA_MODEL],
          ["Catalogue", IM.MODULE_CATALOGUE],
          ["Queries", IM.MODULE_QUERIES]
        ]),
        focusHierarchy: false
      },
      commit: jest.fn()
    };
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    };
    mockRoute = {
      params: { selectedIri: "test Iri" },
      name: "Home"
    };
    wrapper = shallowMount(SideNav, {
      global: {
        components: { Menu, FontAwesomeIcon },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter }
      }
    });
  });

  it("can getItems ___ logged in", async () => {
    expect(wrapper.vm.getItems()).toStrictEqual([
      {
        label: "My account",
        icon: "fa fa-fw fa-user",
        to: "/user/my-account" //+ this.user.id
      },
      {
        label: "Edit account",
        icon: "fa fa-fw fa-user-edit",
        to: "/user/my-account/edit"
      },
      {
        label: "Change password",
        icon: "fa fa-fw fa-user-lock",
        to: "/user/my-account/password-edit"
      },
      {
        label: "Logout",
        icon: "fa fa-fw fa-sign-out-alt",
        to: "/user/logout" //+ this.user.id
      }
    ]);
  });
});
