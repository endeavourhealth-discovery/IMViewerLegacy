import store from "@/store/index";
import {mount} from "@vue/test-utils";
import UserEdit from "@/components/user/UserEdit.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import { User } from "@/models/User";
import { PasswordStrength } from "@/models/PasswordStrength";

describe("userEdit.vue no password edit", () => {
  let wrapper: any;

  beforeEach(() => {
    const user = new User("testUser", "John", "Doe", "john.doe@ergosoft.co.uk", "");
    store.commit("updateCurrentUser", user);
    store.commit("updateIsLoggedIn", true);
    wrapper = mount(UserEdit, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText, InlineMessage}
      },
    });
  })

  it("should render details from current user to form values", async () => {
    const userNameField = wrapper.find("#username");
    let userNameInput = userNameField.element as HTMLInputElement
    const firstNameField = wrapper.find("#firstName");
    let firstNameInput = firstNameField.element as HTMLInputElement
    const lastNameField = wrapper.find("#lastName");
    let lastNameInput = lastNameField.element as HTMLInputElement
    const email1Field = wrapper.find("#email1");
    let email1Input = email1Field.element as HTMLInputElement
    const email2Field = wrapper.find("#email2");
    let email2Input = email2Field.element as HTMLInputElement
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true)
    expect(userNameField.element.id).toBe('username')
    expect(userNameInput.value).toBe("testUser");
    expect(firstNameField.exists()).toBe(true)
    expect(firstNameField.element.id).toBe('firstName')
    expect(firstNameInput.value).toBe("John");
    expect(lastNameField.exists()).toBe(true)
    expect(lastNameField.element.id).toBe('lastName')
    expect(lastNameInput.value).toBe("Doe");
    expect(email1Field.exists()).toBe(true)
    expect(email1Field.element.id).toBe('email1')
    expect(email1Input.value).toBe("john.doe@ergosoft.co.uk");
    expect(email2Field.exists()).toBe(true)
    expect(email2Field.element.id).toBe('email2')
    expect(email2Input.value).toBe("john.doe@ergosoft.co.uk");
  })

  it("transfers currentUser details into editable variables", () => {
    expect(wrapper.vm.username).toBe(wrapper.vm.user.username);
    expect(wrapper.vm.firstName).toBe(wrapper.vm.user.firstName);
    expect(wrapper.vm.lastName).toBe(wrapper.vm.user.lastName);
    expect(wrapper.vm.email1).toBe(wrapper.vm.user.email);
    expect(wrapper.vm.email2).toBe(wrapper.vm.user.email);
  })

  it("should start with all checks true and notices false", () => {
    expect(wrapper.vm.email1Verified).toBe(true);
    expect(wrapper.vm.emailsMatch).toBe(true);
    expect(wrapper.vm.firstNameVerified).toBe(true);
    expect(wrapper.vm.lastNameVerified).toBe(true);
    expect(wrapper.vm.showEmail1Notice).toBe(false);
    expect(wrapper.vm.showEmail2Notice).toBe(false);
    expect(wrapper.vm.showPassword2Notice).toBe(false);
    expect(wrapper.vm.showFirstNameNotice).toBe(false);
    expect(wrapper.vm.showLastNameNotice).toBe(false);
  })

  it("should change showPasswordEdit when password edit button is clicked", () => {
    expect(wrapper.vm.showPasswordEdit).toBe(false);
    const passwordButton = wrapper.find(".password-edit");
    passwordButton.trigger("click");
    wrapper.vm.$nextTick();
    expect(wrapper.vm.showPasswordEdit).toBe(true);
  })

  it("should fail emailVerified with incorrect email format", async () => {
    wrapper.vm.email1 = "johndoe.co.uk";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.email1).toBe("johndoe.co.uk")
    expect(wrapper.vm.email1Verified).toBe(false);
  })

  it("should pass emailVerified with correct email format", async () => {
    expect(wrapper.vm.email1).toBe("john.doe@ergosoft.co.uk");
    expect(wrapper.vm.email1Verified).toBe(true);
  })

  it("should check if emails match __ false", async () => {
    wrapper.vm.email2 = "devtest@ergosoft.co.uk";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.email1).toBe("john.doe@ergosoft.co.uk");
    expect(wrapper.vm.email2).toBe("devtest@ergosoft.co.uk");
    expect(wrapper.vm.emailsMatch).toBe(false);
  })

  it("should check if emails match __ true", async () => {
    expect(wrapper.vm.email1).toBe("john.doe@ergosoft.co.uk");
    expect(wrapper.vm.email2).toBe("john.doe@ergosoft.co.uk");
    expect(wrapper.vm.emailsMatch).toBe(true);
  })

  it("should check if firstName is valid __ false", async () => {
    wrapper.vm.firstName = "John$";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.firstNameVerified).toBe(false);
  })

  it("should check if firstName is valid __ true", async () => {
    wrapper.vm.firstName = "John";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.firstNameVerified).toBe(true);
  })

  it("should check if lastName is valid __ false", async () => {
    wrapper.vm.lastName = "D*e";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.lastNameVerified).toBe(false);
  })

  it("should check if lastName is valid __ true", async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.lastNameVerified).toBe(true);
  })

  it("should check password strength __ fail", async () => {
    wrapper.vm.passwordNew1 = "1234";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("1234");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.fail);
  })

  it("should check password strength __ weak", async () => {
    wrapper.vm.passwordNew1 = "12345678";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("12345678");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.weak);
  })

  it("should check password strength __ medium", async () => {
    wrapper.vm.passwordNew1 = "1234abcd";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("1234abcd");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.medium);
  })

  it("should check password strength __ strong", async () => {
    wrapper.vm.passwordNew1 = "1234ABc%";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("1234ABc%");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.strong);
  })

  it("should check passwords match __ fail", async () => {
    wrapper.vm.passwordNew1 = "12345678";
    wrapper.vm.passwordNew2 = "12345679";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("12345678");
    expect(wrapper.vm.passwordNew2).toBe("12345679");
    expect(wrapper.vm.passwordsMatch).toBe(false);
  })

  it("should check passwords match __ pass", async () => {
    wrapper.vm.passwordNew1 = "12345678";
    wrapper.vm.passwordNew2 = "12345678";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.passwordNew1).toBe("12345678");
    expect(wrapper.vm.passwordNew2).toBe("12345678");
    expect(wrapper.vm.passwordsMatch).toBe(true);
  })
})
