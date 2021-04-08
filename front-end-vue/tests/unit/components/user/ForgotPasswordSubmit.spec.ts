import store from "@/store/index";
// import { createStore } from 'vuex';
import Card from "primevue/card";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import { mount } from "@vue/test-utils";
import ForgotPasswordSubmit from "@/components/user/ForgotPasswordSubmit.vue";
import InputText from "primevue/inputtext";
import { PasswordStrength } from "@/models/PasswordStrength";

describe("ForgotPasswordSubmit.vue no registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ForgotPasswordSubmit, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText, InlineMessage }
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

describe("ForgotPasswordSubmit.vue with registeredUser", () => {
  let wrapper: any;

  beforeEach(() => {
    store.commit("updateRegisteredUsername", "testUser");
    wrapper = mount(ForgotPasswordSubmit, {
      global: {
        plugins: [store],
        components: { Card, Button, InputText, InlineMessage }
      }
    });
  });

  it("starts with username if store has registeredUsername", async () => {
    const userNameField = wrapper.find("#fieldUsername");
    const userNameInput = userNameField.element as HTMLInputElement;
    await wrapper.vm.$nextTick();
    expect(userNameField.exists()).toBe(true);
    expect(userNameField.element.id).toBe("fieldUsername");
    expect(userNameInput.value).toBe("testUser");
  });

  it("start with all checks false", () => {
    expect(wrapper.vm.codeVerified).toBe(false);
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.fail);
    expect(wrapper.vm.passwordsMatch).toBe(false);
    expect(wrapper.vm.showPassword2Notice).toBe(false);
  });

  it("can verify a confirmation code __ false", async () => {
    wrapper.vm.code = "12345";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.codeVerified).toBe(false);
  });

  it("can verify a confirmation code __ true", async () => {
    wrapper.vm.code = "123456";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.codeVerified).toBe(true);
  });

  it("should check password strength __ fail", async () => {
    wrapper.vm.newPassword1 = "1234";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("1234");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.fail);
  });

  it("should check password strength __ weak", async () => {
    wrapper.vm.newPassword1 = "12345678";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("12345678");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.weak);
  });

  it("should check password strength __ medium", async () => {
    wrapper.vm.newPassword1 = "1234abcd";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("1234abcd");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.medium);
  });

  it("should check password strength __ strong", async () => {
    wrapper.vm.newPassword1 = "1234ABc%";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("1234ABc%");
    expect(wrapper.vm.passwordStrength).toBe(PasswordStrength.strong);
  });

  it("should check passwords match __ fail", async () => {
    wrapper.vm.newPassword1 = "12345678";
    wrapper.vm.newPassword2 = "12345679";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("12345678");
    expect(wrapper.vm.newPassword2).toBe("12345679");
    expect(wrapper.vm.passwordsMatch).toBe(false);
  });

  it("should check passwords match __ pass", async () => {
    wrapper.vm.newPassword1 = "12345678";
    wrapper.vm.newPassword2 = "12345678";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.newPassword1).toBe("12345678");
    expect(wrapper.vm.newPassword2).toBe("12345678");
    expect(wrapper.vm.passwordsMatch).toBe(true);
  });
});
