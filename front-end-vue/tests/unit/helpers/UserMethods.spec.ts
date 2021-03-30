import { verifyIsEmail, verifyPasswordsMatch, verifyIsName, verifyIsUsername, checkPasswordStrength} from "@/helpers/UserMethods";

describe("verifyIsEmail", () => {
  it("should fail if empty", () => {
    const email = "";
    expect(verifyIsEmail(email)).toBe(false);
  })
})
