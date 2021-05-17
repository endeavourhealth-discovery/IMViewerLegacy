import { mount, flushPromises } from "@vue/test-utils";
import Login from "@/components/user/Login.vue";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AuthService from "@/services/AuthService";
import Swal from "sweetalert2";
import { User } from "@/models/user/User";

const testUser = new User("devtest", "John", "Doe", "john.doe@ergosoft.co.uk", "", { value: "colour/001-man.png"});

testUser.setId("9gkej864-l39k-9u87-4lau-w7777b3m5g09")

AuthService.signIn = jest.fn().mockResolvedValue({ status: 200, message: "Password reset successful", user: testUser });

Swal.fire = jest.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }));

describe("login.vue no registeredUser", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      state: {registeredUsername: ""},
      commit: jest.fn()
    }
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    wrapper = mount(Login, {
      global: {
        components: { Card, Button, InputText },
        mocks: { $store: mockStore, $router: mockRouter }
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
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      state: {registeredUsername: "testUser"},
      commit: jest.fn()
    }
    mockRouter = {
      push: jest.fn(),
      go: jest.fn()
    }
    wrapper = mount(Login, {
      global: {
        components: { Card, Button, InputText },
        mocks: { $store: mockStore, $router: mockRouter }
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

  it("hits the Authservice on handleSubmit", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toBeCalledTimes(1);
    expect(AuthService.signIn).toBeCalledWith("Devtest", "12345678");
  });

  it("updates the store on successful login", async () => {
    wrapper.vm.username = "Devtest";
    wrapper.vm.password = "12345678";
    wrapper.vm.handleSubmit();
    await wrapper.vm.$nextTick();
    expect(AuthService.signIn).toHaveReturned();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenCalledTimes(3);
    expect(mockStore.commit.mock.calls).toEqual([
      ["updateCurrentUser", {"avatar": {"value": "colour/001-man.png"}, "email": "john.doe@ergosoft.co.uk", "firstName": "John", "id": "9gkej864-l39k-9u87-4lau-w7777b3m5g09", "lastName": "Doe", "password": "", "username": "devtest"}],
      ["updateRegisteredUsername", null],
      ["updateIsLoggedIn", true]
    ]);
  });
});
