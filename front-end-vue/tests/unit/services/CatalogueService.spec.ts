import axios from "axios";
import CatalogueService from "@/services/CatalogueService";

describe("CatalogueService.ts", () => {
  const api = process.env.VUE_APP_API;

  beforeEach(() => {
    jest.resetAllMocks();
    axios.get = jest.fn().mockResolvedValue("axios get return");
  });

  it("can get search results", async () => {
    const result = await CatalogueService.getSearchResult("testTerm", ["testType"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "instance/search", {
      params: { request: "testTerm", typesIris: ["testType"].join(",") }
    });
    expect(result).toBe("axios get return");
  });

  it("can get partial instance", async () => {
    const result = await CatalogueService.getPartialInstance("testIri", ["testPredicate"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "instance/partial", {
      params: { iri: "testIri", predicate: ["testPredicate"] }
    });
    expect(result).toBe("axios get return");
  });

  it("can get types and counts", async () => {
    const result = await CatalogueService.getTypesCount();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "instance/typesCount");
    expect(result).toBe("axios get return");
  });
});
