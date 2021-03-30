import store from "@/store/index";
import {mount} from "@vue/test-utils";
import Register from "@/components/user/Register.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InlineMessage from "primevue/inlinemessage";
import Button from "primevue/button";
import {PasswordStrength} from "@/models/PasswordStrength"

describe("register.vue", () => {
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
