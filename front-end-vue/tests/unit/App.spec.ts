import store from "@/store/index";
import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Toast from "primevue/toast";

describe("App.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(App, {
      global: {
        plugins: [store],
        components: { Toast },
        stubs: ["router-link", "router-view"]
      },
    });
  });

  it("should update store history count on mount", () => {
    expect(store.state.historyCount).toBeGreaterThan(0);
  })
});
