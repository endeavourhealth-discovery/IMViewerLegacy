import store from "@/store/index";
import {mount} from "@vue/test-utils";
import Register from "@/components/user/Register.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import {PasswordStrength} from "@/models/PasswordStrength"

describe("register.vue empty", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Register, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText, InlineMessage}
      },
    });
  })

  it("should start with all checks false/fail", () => {
    expect(wrapper.vm.email1Verified).toBe(false);
    expect(wrapper.vm.emailsMatch).toBe(false);
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.fail);
    expect(wrapper.vm.passwordsMatch).toBe(false);
    expect(wrapper.vm.showEmail1Notice).toBe(false);
    expect(wrapper.vm.showEmail2Notice).toBe(false);
    expect(wrapper.vm.showPassword2Notice).toBe(false);
  })
})

describe("register.vue prefilled", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Register, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText, InlineMessage}
      }
    })
    wrapper.vm.username = "DevTest";
    wrapper.vm.email1 = "devtest@ergo.co.uk";
    wrapper.vm.email2 = "devtest@ergo.co.uk";
    wrapper.vm.password1 = "12345678";
    wrapper.vm.password2 = "12345678";
    wrapper.vm.firstName = "John";
    wrapper.vm.lastName = "Doe";
  })

  it("should render data to form", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    let userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe('fieldUsername');
    expect(userNameInput.value).toBe("DevTest");
  })
})
