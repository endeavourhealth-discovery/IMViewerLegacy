import store from "@/store/index";
import {mount} from "@vue/test-utils";
import UserDetails from "@/components/user/UserDetails.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { User } from "@/models/User";

describe("userDetails.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    const user = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "");
    store.commit("updateCurrentUser", user);
    store.commit("updateIsLoggedIn", true);
    wrapper = mount(UserDetails, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText}
      },
    });
  })

  it('correctly renders User details from store', async() => {
      const userNameField = wrapper.find("#username");
      let userNameInput = userNameField.element as HTMLInputElement
      await wrapper.vm.$nextTick();
      expect(userNameField.exists()).toBe(true)
      expect(userNameField.element.id).toBe('username')
      expect(userNameInput.value).toBe("testUser");
      const firstNameField = wrapper.find("#firstName");
      let firstNameInput = firstNameField.element as HTMLInputElement
      await wrapper.vm.$nextTick();
      expect(firstNameField.exists()).toBe(true)
      expect(firstNameField.element.id).toBe('firstName')
      expect(firstNameInput.value).toBe("John");
      const lastNameField = wrapper.find("#lastName");
      let lastNameInput = lastNameField.element as HTMLInputElement
      await wrapper.vm.$nextTick();
      expect(lastNameField.exists()).toBe(true)
      expect(lastNameField.element.id).toBe('lastName')
      expect(lastNameInput.value).toBe("Doe");
      const emailField = wrapper.find("#email");
      let emailInput = emailField.element as HTMLInputElement
      await wrapper.vm.$nextTick();
      expect(emailField.exists()).toBe(true)
      expect(emailField.element.id).toBe('email')
      expect(emailInput.value).toBe("john.doe@ergosoft.co.uk");
  })
})
