import { colorLighter } from "@/helpers/ColorMethods";

describe("colorLighter", () => {
  it("should convert a hex colour to 50% lighter than original", () => {
    const original = "#000000";
    const lighter = colorLighter(original);
    expect(lighter).toBe("#808080");
  })
})
