import store from "@/store/index";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Header from "@/components/home/Header.vue";
import SidebarControl from "@/components/sidebar/SidebarControl.vue";
import SideNav from "@/components/home/SideNav.vue";

describe("User.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
        components: { Header, SidebarControl, SideNav },
        stubs: ["router-link", "router-view"]
      },
    });
    store.commit("updateSnomedLicenseAccepted", "true");
  });

  it("should render containers", () => {
    expect(wrapper.find(".layout-main")).toBeTruthy();
    expect(wrapper.find(".main-grid")).toBeTruthy();
  });

  it("should check for authenticated user", () => {

  })
});
