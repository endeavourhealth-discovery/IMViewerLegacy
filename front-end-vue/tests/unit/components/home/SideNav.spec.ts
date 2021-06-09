import { shallowMount } from "@vue/test-utils";
import SideNav from "@/components/home/SideNav.vue";
import Menu from "primevue/menu";
import { User } from "@/models/user/User";

describe("SideNav.spec ___ not logged in", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(() => {
    mockStore = {
      state: {
        currentUser: null,
        isLoggedIn: false
      },
      commit: jest.fn()
    };
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    mockRoute = {
      params: {selectedIri: "test Iri" },
      name: "Home"
    };
    wrapper = shallowMount(SideNav, {
      global: {
        components: { Menu },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter }
      }
    });
  });

  it("starts with the correct data", () => {
    expect(wrapper.vm.userPopupBottom).toBe(0);
    expect(wrapper.vm.loginItems).toStrictEqual([
      {
        label: "Login",
        icon: "pi pi-fw pi-user",
        to: "/user/login"
      },
      {
        label: "Register",
        icon: "pi pi-fw pi-user-plus",
        to: "/user/register"
      }
    ]);
    expect(wrapper.vm.accountItems).toStrictEqual([
      {
        label: "My account",
        icon: "pi pi-fw pi-user",
        to: "/user/my-account" //+ this.user.id
      },
      {
        label: "Edit account",
        icon: "pi pi-fw pi-user-edit",
        to: "/user/my-account/edit"
      },
      {
        label: "Change password",
        icon: "pi pi-fw pi-lock",
        to: "/user/my-account/password-edit"
      },
      {
        label: "Logout",
        icon: "pi pi-fw pi-lock-open",
        to: "/user/logout" //+ this.user.id
      }
    ]);
  });

  it("can determine isActive ___ true", () => {
    expect(wrapper.vm.isActive("Home")).toBeTruthy();
  });

  it("can determine isActive ___ false", () => {
    expect(wrapper.vm.isActive("Concept")).toBeFalsy();
  });

  it("can getItems ___ not logged in", () => {
    expect(wrapper.vm.getItems()).toStrictEqual([
      {
        label: "Login",
        icon: "pi pi-fw pi-user",
        to: "/user/login"
      },
      {
        label: "Register",
        icon: "pi pi-fw pi-user-plus",
        to: "/user/register"
      }
    ]);
  });

  it("returns the correct image url", async () => {
    jest.mock("@/assets/avatars/colour/013-woman.png", () => {
      return "/img/013-woman.7f32b854.png"
    })
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toBe("/img/013-woman.7f32b854.png");
  });

  it("can reset to home", async() => {
    wrapper.vm.resetToHome();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith(
      "updateConceptIri",
      "http://endhealth.info/im#DiscoveryOntology"
    );
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Dashboard" });
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
        currentUser: new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "12345678", { value: "colour/001-man.png" }),
        isLoggedIn: true
      },
      commit: jest.fn()
    };
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    mockRoute = {
      params: {selectedIri: "test Iri" },
      name: "Home"
    };
    wrapper = shallowMount(SideNav, {
      global: {
        components: { Menu },
        mocks: { $store: mockStore, $route: mockRoute, $router: mockRouter }
      }
    });
  });

  it("can getItems ___ logged in", async() => {
    expect(wrapper.vm.getItems()).toStrictEqual([
      {
        label: "My account",
        icon: "pi pi-fw pi-user",
        to: "/user/my-account" //+ this.user.id
      },
      {
        label: "Edit account",
        icon: "pi pi-fw pi-user-edit",
        to: "/user/my-account/edit"
      },
      {
        label: "Change password",
        icon: "pi pi-fw pi-lock",
        to: "/user/my-account/password-edit"
      },
      {
        label: "Logout",
        icon: "pi pi-fw pi-lock-open",
        to: "/user/logout" //+ this.user.id
      }
    ]);
  });
});
