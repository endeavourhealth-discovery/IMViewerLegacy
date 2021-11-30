import router from "@/router/index";
import { shallowMount } from "@vue/test-utils";

describe("router", () => {
  let wrapper;
  let mockStore;

  beforeEach(async () => {
    jest.resetAllMocks();
    window.sessionStorage.clear();
    router.push("/");
    await router.isReady();

    mockStore = {
      state: { historyCount: 1 },
      commit: jest.fn(),
      dispatch: jest.fn()
    };

    wrapper = shallowMount(App, {
      global: {
        components: { Toast },
        mocks: { $store: mockStore },
        plugins: [router]
      }
    });
  });

  it("routes to home", () => {
    expect(wrapper.vm.$route.path).toBe("/");
  });
});
