import { flushPromises } from "@vue/test-utils";
import { Auth } from "aws-amplify";
import AuthService from "@/services/AuthService";
import { User } from "@/models/user/User";
import { CustomAlert } from "@/models/user/CustomAlert";

Auth.confirmSignUp = jest.fn().mockResolvedValue({ status: 200, message: "test confirm code"});

const testUser = new User("devTest", "John", "Doe", "john.doe@ergosoft.co.uk", "12345678", { value: "colour/002-man.png" });

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 with auth success", async () => {
    Auth.signUp = jest.fn().mockResolvedValue({ status: 200, message: "test confirm code"});
    const result = AuthService.register(testUser);
    let promiseResult: any;
    result.then(res => {
      promiseResult = res
    })
    await flushPromises()
    expect(Auth.signUp).toBeCalledTimes(1);
    expect(Auth.signUp).toBeCalledWith({ username: "devTest", password: "12345678", attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png"}});
    expect(promiseResult).toStrictEqual(new CustomAlert(201, "User registered successfully"));
  });

  it("returns 409 with auth fail ___ username exists", async () => {
    Auth.signUp = jest.fn().mockRejectedValue({ code: "UsernameExistsException", name: "testError", message: "User already exists" });
    const result = AuthService.register(testUser);
    let promiseResult: any;
    let err: any;
    result.then(res => {
      err = res.error
      promiseResult = res
    });
    await flushPromises()
    expect(Auth.signUp).toBeCalledTimes(1);
    expect(Auth.signUp).toBeCalledWith({ username: "devTest", password: "12345678", attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png"}});
    expect(promiseResult).toStrictEqual(new CustomAlert(409, "Username already exists", err));
  });

  it("returns 400 with auth fail ___ fail", async () => {
    Auth.signUp = jest.fn().mockRejectedValue("test");
    const result = AuthService.register(testUser);
    let promiseResult: any;
    let err: any;
    result.then(res => {
      err = res.error
      promiseResult = res
    });
    await flushPromises()
    expect(Auth.signUp).toBeCalledTimes(1);
    expect(Auth.signUp).toBeCalledWith({ username: "devTest", password: "12345678", attributes: { email: "john.doe@ergosoft.co.uk", "custom:forename": "John", "custom:surname": "Doe", "custom:avatar": "colour/002-man.png"}});
    expect(promiseResult).toStrictEqual(new CustomAlert(400, "User registration failed", err));
  });
});

describe("confirmRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with auth success", async () => {
    Auth.confirmSignUp = jest.fn().mockResolvedValue({ status: 200, message: "test confirm code"});
    const result = AuthService.confirmRegister("devTest", "123456");
    let promiseResult: any;
    result.then(res => {
      promiseResult = res
    })
    await flushPromises()
    expect(Auth.confirmSignUp).toBeCalledTimes(1);
    expect(Auth.confirmSignUp).toBeCalledWith("devTest", "123456");
    expect(promiseResult).toStrictEqual(new CustomAlert(200, "Register confirmation successful"));
  });

  it("returns 403 with auth fail", async () => {
    Auth.confirmSignUp = jest.fn().mockRejectedValue({ code: "TestErrorCode", name: "testError", message: "CodeRejected" });
    const result = AuthService.confirmRegister("devTest", "123456");
    let promiseResult: any;
    let err: any;
    result.then(res => {
      err = res.error
      promiseResult = res
    });
    await flushPromises()
    expect(Auth.confirmSignUp).toBeCalledTimes(1);
    expect(Auth.confirmSignUp).toBeCalledWith("devTest", "123456");
    expect(promiseResult).toStrictEqual(new CustomAlert(403, "Failed register confirmation", err));
  });
});
