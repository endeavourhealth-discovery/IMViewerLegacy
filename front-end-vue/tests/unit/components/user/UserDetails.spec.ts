import store from "@/store/index";
import { mount } from "@vue/test-utils";
import UserDetails from "@/components/user/UserDetails.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { User } from "@/models/user/User";

describe("userDetails.vue", () => {
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
    wrapper = mount(UserDetails, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText }
      }
    });
  });

  it("correctly renders User details from store", async () => {
    const userNameField = wrapper.find("#username");
    const userNameInput = userNameField.element as HTMLInputElement;
    const firstNameField = wrapper.find("#firstName");
    const firstNameInput = firstNameField.element as HTMLInputElement;
    const lastNameField = wrapper.find("#lastName");
    const lastNameInput = lastNameField.element as HTMLInputElement;
    const emailField = wrapper.find("#email");
    const emailInput = emailField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("username");
    expect(userNameInput.value).toBe("testUser");
    expect(firstNameField.exists()).toBe(true);
    expect(firstNameField.element.id).toBe("firstName");
    expect(firstNameInput.value).toBe("John");
    expect(lastNameField.exists()).toBe(true);
    expect(lastNameField.element.id).toBe("lastName");
    expect(lastNameInput.value).toBe("Doe");
    expect(emailField.exists()).toBe(true);
    expect(emailField.element.id).toBe("email");
    expect(emailInput.value).toBe("john.doe@ergosoft.co.uk");
  });
});
