import { verifyIsEmail, verifyPasswordsMatch, verifyIsName, verifyIsUsername, checkPasswordStrength} from "@/helpers/UserMethods";

describe("verifyIsEmail", () => {
  it("should fail if empty", () => {
    const email = "";
    expect(verifyIsEmail(email)).toBe(false);
  })

  it("should pass if is correct email", () => {
    const email = "johndoe@gmail.com";
    expect(verifyIsEmail(email)).toBe(true);
  })

  it("should accept 2 '.' after the @", () => {
    const email = "johndoe@gmail.co.uk";
    expect(verifyIsEmail(email)).toBe(true);
  })

  it("should fail without an @ before the last .", () => {
    const email = "johndoe.gmail.com";
    expect(verifyIsEmail(email)).toBe(false);
  })

  it("should fail if contains multiple '@'", () => {
    const email = "john@doe@gmail.com";
    expect(verifyIsEmail(email)).toBe(false);
  })

  it("should fail if starts with an @", () => {
    const email = "@gmail.com";
    expect(verifyIsEmail(email)).toBe(false);
  })
})

describe("verifyPasswordsMatch", () => {
  it("should fail if passwords are empty", () => {
    const password1 = "";
    const password2 = "";
    expect(verifyPasswordsMatch(password1, password2)).toBe(false);
  })

  it("should fail if either password is empty __ password1", () => {
    const password1 = "";
    const password2 = "12345678";
    expect(verifyPasswordsMatch(password1, password2)).toBe(false);
  })

  it("should fail if either password is empty __ password2", () => {
    const password1 = "12345678";
    const password2 = "";
    expect(verifyPasswordsMatch(password1, password2)).toBe(false);
  })

  it("should fail if passwords don't match", () => {
    const password1 = "12345678";
    const password2 = "12345679";
    expect(verifyPasswordsMatch(password1, password2)).toBe(false);
  })

  it("should pass if passwords match", () => {
    const password1 = "12345678";
    const password2 = "12345678";
    expect(verifyPasswordsMatch(password1, password2)).toBe(true);
  })

  it("should handle case sensitivity", () => {
    const password1 = "passWORD";
    const password2 = "password";
    expect(verifyPasswordsMatch(password1, password2)).toBe(false);
  })
})

describe("verifyIsName", () => {
  it("should fail if empty", () => {
    const name = "";
    expect(verifyIsName(name)).toBe(false);
  })
})
