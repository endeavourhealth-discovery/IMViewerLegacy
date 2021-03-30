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
})
