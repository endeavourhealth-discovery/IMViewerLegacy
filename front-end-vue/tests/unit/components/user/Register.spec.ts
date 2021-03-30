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
    const emailField = wrapper.find("#fieldEmail1");
    let email1Input = emailField.element as HTMLInputElement;
    const email2Field = wrapper.find("#fieldEmail2");
    let email2Input = email2Field.element as HTMLInputElement;
    const firstNameField = wrapper.find("#fieldFirstName");
    let firstNameInput = firstNameField.element as HTMLInputElement;
    const lastNameField = wrapper.find("#fieldLastName");
    let lastNameInput = lastNameField.element as HTMLInputElement;
    const password1Field = wrapper.find("#fieldPassword1");
    let password1Input = password1Field.element as HTMLInputElement;
    const password2Field = wrapper.find("#fieldPassword2");
    let password2Input = password2Field.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe('fieldUsername');
    expect(userNameInput.value).toBe("DevTest");
    expect(emailField.exists()).toBe(true);
    expect(emailField.element.id).toBe('fieldEmail1');
    expect(email1Input.value).toBe("devtest@ergo.co.uk");
    expect(email2Field.exists()).toBe(true);
    expect(email2Field.element.id).toBe('fieldEmail2');
    expect(email2Input.value).toBe("devtest@ergo.co.uk");
    expect(firstNameField.exists()).toBe(true);
    expect(firstNameField.element.id).toBe('fieldFirstName');
    expect(firstNameInput.value).toBe("John");
    expect(lastNameField.exists()).toBe(true);
    expect(lastNameField.element.id).toBe('fieldLastName');
    expect(lastNameInput.value).toBe("Doe");
    expect(password1Field.exists()).toBe(true);
    expect(password1Field.element.id).toBe('fieldPassword1');
    expect(password1Input.value).toBe("12345678");
    expect(password2Field.exists()).toBe(true);
    expect(password2Field.element.id).toBe('fieldPassword2');
    expect(password2Input.value).toBe("12345678");
  })

  it("should fail emailVerified with incorrect email format", async () => {
    wrapper.vm.email1 = "johndoe.co.uk";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.email1).toBe("johndoe.co.uk")
    expect(wrapper.vm.email1Verified).toBe(false);
  })

  it("should pass emailVerified with correct email format", async () => {
    expect(wrapper.vm.email1).toBe("devtest@ergo.co.uk");
    expect(wrapper.vm.email1Verified).toBe(true);
  })

  it("should check if emails match __ false", async () => {
    wrapper.vm.email2 = "devtest.co.uk";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.email1).toBe("devtest@ergo.co.uk");
    expect(wrapper.vm.email2).toBe("devtest.co.uk");
    expect(wrapper.vm.emailsMatch).toBe(false);
  })

  it("should check if emails match __ true", async () => {
    expect(wrapper.vm.email1).toBe("devtest@ergo.co.uk");
    expect(wrapper.vm.email2).toBe("devtest@ergo.co.uk");
    expect(wrapper.vm.emailsMatch).toBe(true);
  })
})
