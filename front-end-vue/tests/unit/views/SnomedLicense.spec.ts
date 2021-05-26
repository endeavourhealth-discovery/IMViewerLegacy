import { flushPromises, mount } from "@vue/test-utils";
import SnomedLicense from "@/views/SnomedLicense.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

describe("SnomedLicense.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    mockStore = {
      state: { snomedLicenseAccepted: "false", historyCount: 1 },
      commit: jest.fn()
    };
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    };
    wrapper = mount(SnomedLicense, {
      global: {
        components: { Dialog, Button },
        mocks: { $store: mockStore, $router: mockRouter },
      }
    });
  });

  it("updates showDialog from store snomedLicenseAccepted ___ true", async() => {
    wrapper.vm.$options.watch.snomedLicenseAccepted.call(wrapper.vm, "false");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDialog).toBe(true);
  });

  it("updates showDialog from store snomedLicenseAccepted __ false", async() => {
    wrapper.vm.$options.watch.snomedLicenseAccepted.call(wrapper.vm, "true");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDialog).toBe(false);
  });

  it("updates store and reroutes on submitAgree ___ dashboard", async() => {
    wrapper.vm.submitAgree();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(1);
    expect(mockStore.commit).toBeCalledWith("updateSnomedLicenseAccepted", "true");
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith({ name: "Dashboard" });
  });

  it("updates store and reroutes on submitAgree ___ back", async() => {
    wrapper.vm.$store.state.historyCount = 0;
    wrapper.vm.submitAgree();
    await wrapper.vm.$nextTick();
    expect(mockStore.commit).toBeCalledTimes(1);
    expect(mockStore.commit).toBeCalledWith("updateSnomedLicenseAccepted", "true");
    expect(mockRouter.go).toBeCalledTimes(1);
    expect(mockRouter.go).toBeCalledWith(-1);
  });
});