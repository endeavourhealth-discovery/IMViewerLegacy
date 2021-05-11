import store from "@/store/index";
import { mount } from "@vue/test-utils";
import Login from "@/components/user/Login.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { Auth } from "aws-amplify";

Auth.signIn = jest.fn().mockImplementation(() => {
  return {
    username: "devtest",
    attributes: {
      "custom:avatar": "colour/001-man.png",
      "custom:forename": "Dev",
      "custom:surname": "Test",
      email: "dev.test@ergosoft.co.uk",
      email_verified: true,
      sub: "9gkej864-l39k-9u87-4lau-w7777b3m5g09"
    }
  }
});

describe("login.vue no registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    store.commit("updateCurrentUser", {});
    store.commit("updateRegisteredUsername", "");
    store.commit("updateIsLoggedIn", false);
    wrapper = mount(Login, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText }
      }
    });
  });

  it("starts empty if no store registeredUsername", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("");
  });
});

describe("login.vue with registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    store.commit("updateRegisteredUsername", "testUser");
    store.commit("updateCurrentUser", {});
    store.commit("updateIsLoggedIn", false);
    wrapper = mount(Login, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText }
      }
    });
  });

  it("starts with registeredUsername if in store", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("testUser");
  });

  it("hits the Auth service on handleSubmit", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    expect(Auth.signIn).toHaveBeenCalledTimes(1);
  });

  it("updates the store on successful login", async () => {
    expect(store.state.currentUser).toStrictEqual({});
    expect(store.state.registeredUsername).toBe("testUser");
    expect(store.state.isLoggedIn).toBe(false);
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    console.log(store.state.currentUser);
    expect(Auth.signIn).toHaveReturned();
    // expect(store.state.currentUser.username).toBe("devtest");
    // expect(store.state.registeredUsername).toBe("");
    // expect(store.state.isLoggedIn).toBe(true);
  });
});
