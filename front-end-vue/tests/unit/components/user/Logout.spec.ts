import store from "@/store/index";
// import { createStore } from 'vuex';
import Card from "primevue/card";
import Button from "primevue/button";
import { mount } from "@vue/test-utils";
import Logout from "@/components/user/Logout.vue";
import { User } from "@/models/user/User";

describe("Logout.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    const user = new User(
      "testUser",
      "John",
      "Doe",
      "john.doe@ergosoft.co.uk",
      "",
      { value: "colour/001-man.png" }
    );
    store.commit("updateCurrentUser", user);
    store.commit("updateIsLoggedIn", true);
    wrapper = mount(Logout, {
      global: {
        plugins: [store],
        components: { Card, Button }
      }
    });
  });

  it("renders current username", async () => {
    const userNameField = wrapper.find("#username-display");
    const userNameInput = userNameField.element as HTMLParagraphElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("username-display");
    expect(userNameInput.textContent).toBe("testUser");
  });
});
