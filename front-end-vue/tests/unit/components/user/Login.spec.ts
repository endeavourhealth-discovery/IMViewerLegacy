import store from "@/store/index";
import {mount} from "@vue/test-utils";
import Login from "@/components/user/Login.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {PasswordStrength} from "@/models/PasswordStrength"

describe("login.vue no registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Login, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText}
      },
    });
  })

  it('starts empty if no store registeredUsername', async() => {
      const userNameField = wrapper.find("#fieldUsername");
      let userNameInput = userNameField.element as HTMLInputElement
      await wrapper.vm.$nextTick();
      expect(userNameField.exists()).toBe(true)
      expect(userNameField.element.id).toBe('fieldUsername')
      expect(userNameInput.value).toBe("");
  })
})

describe("login.vue with registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    store.commit("updateRegisteredUsername", "testUser");
    wrapper = mount(Login, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText}
      },
    });
  })

  it('starts with registeredUsername if in store', async() => {
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('fieldUsername')
    expect(userNameInput.value).toBe("testUser");
  })
})
