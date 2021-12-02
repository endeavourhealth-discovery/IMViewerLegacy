import { SearchRequest } from "@/models/search/SearchRequest";
import EntityService from "@/services/EntityService";
import axios from "axios";

describe("EntityService.ts ___ axios success", () => {
  const api = process.env.VUE_APP_API;

  beforeEach(() => {
    jest.resetAllMocks();
    axios.get = jest.fn().mockResolvedValue("axios get return");
    axios.post = jest.fn().mockResolvedValue("axios post return");
  });

  it("can get partial entity", async () => {
    const result = await EntityService.getPartialEntity("testIri", ["pred_1", "pred_2", "pred_3"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/partial", { params: { iri: "testIri", predicate: "pred_1,pred_2,pred_3" } });
    expect(result).toBe("axios get return");
  });

  it("can post advancedSearch", async () => {
    const request = new SearchRequest();
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.advancedSearch(request, cancelToken);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(api + "api/entity/search", request, { cancelToken: cancelToken });
    expect(result).toBe("axios post return");
  });

  it("can get entity definition dto", async () => {
    const result = await EntityService.getEntityDefinitionDto("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/definition", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get entity parents", async () => {
    const result = await EntityService.getEntityParents("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/parents", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get entity children", async () => {
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.getEntityChildren("testIri", undefined, cancelToken);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/children", { params: { iri: "testIri" }, cancelToken: cancelToken });
    expect(result).toBe("axios get return");
  });

  it("can get entity usages", async () => {
    const result = await EntityService.getEntityUsages("testIri", 1, 25);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/usages", { params: { iri: "testIri", page: 1, size: 25 } });
    expect(result).toBe("axios get return");
  });

  it("can get usages total records", async () => {
    const result = await EntityService.getUsagesTotalRecords("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/usagesTotalRecords", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get entity members", async () => {
    const result = await EntityService.getEntityMembers("testIri", true, true, 1000);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/members", { params: { iri: "testIri", expandMembers: true, expandSubsets: true, limit: 1000 } });
    expect(result).toBe("axios get return");
  });

  it("can get entity graph", async () => {
    const result = await EntityService.getEntityGraph("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/graph", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get entity term codes", async () => {
    const result = await EntityService.getEntityTermCodes("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/termCode", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get partial bundle", async () => {
    const result = await EntityService.getPartialEntityBundle("testIri", ["testPredicate1", "testPredicate2"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/partialBundle", { params: { iri: "testIri", predicate: "testPredicate1,testPredicate2" } });
    expect(result).toBe("axios get return");
  });

  it("can getInferredBundle", async () => {
    const result = await EntityService.getDefinitionBundle("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/inferredBundle", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can getInferredAsString", async () => {
    const result = await EntityService.getInferredAsString("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/inferredAsString", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can getAxiomBundle", async () => {
    const result = await EntityService.getAxiomBundle("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/axiomBundle", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can getAxiomAsString", async () => {
    const result = await EntityService.getAxiomAsString("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/axiomAsString", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get data model properties", async () => {
    const result = await EntityService.getDataModelProperties("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/dataModelProperties", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get entity summary", async () => {
    const result = await EntityService.getEntitySummary("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/summary", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  //obsolete, to be deleted on editor branch merge
  it("can get entity", async () => {
    const result = await EntityService.getEntity("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity", { params: { iri: "testIri" } });
    expect(result).toBe("axios get return");
  });

  it("can get get namespaces", async () => {
    const result = await EntityService.getNamespaces();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/namespaces");
    expect(result).toBe("axios get return");
  });

  it("can get ECLSearch", async () => {
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.ECLSearch("testString", false, 1000, cancelToken);
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(api + "api/set/eclSearch", "testString", {
      headers: { "Content-Type": "text/plain" },
      params: { includeLegacy: false, limit: 1000 },
      cancelToken: cancelToken
    });
    expect(result).toBe("axios post return");
  });

  it("can getMatchedFrom", async () => {
    const result = await EntityService.getMatchedFrom("testString");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/matchedFrom", { params: { iri: "testString" } });
    expect(result).toBe("axios get return");
  });
});

describe("EntityService.ts ___ axios fail", () => {
  const api = process.env.VUE_APP_API;

  beforeEach(() => {
    jest.resetAllMocks();
    axios.get = jest.fn().mockRejectedValue(false);
    axios.post = jest.fn().mockRejectedValue(false);
  });

  it("can get partial entity", async () => {
    const result = await EntityService.getPartialEntity("testIri", ["pred_1", "pred_2", "pred_3"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/partial", { params: { iri: "testIri", predicate: "pred_1,pred_2,pred_3" } });
    expect(result).toStrictEqual({});
  });

  it("can post advancedSearch", async () => {
    const request = new SearchRequest();
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.advancedSearch(request, cancelToken);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(api + "api/entity/search", request, { cancelToken: cancelToken });
    expect(result).toStrictEqual({});
  });

  it("can get entity definition dto", async () => {
    const result = await EntityService.getEntityDefinitionDto("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/definition", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can get entity parents", async () => {
    const result = await EntityService.getEntityParents("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/parents", { params: { iri: "testIri" } });
    expect(result).toStrictEqual([]);
  });

  it("can get entity children", async () => {
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.getEntityChildren("testIri", undefined, cancelToken);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/children", { params: { iri: "testIri" }, cancelToken: cancelToken });
    expect(result).toStrictEqual([]);
  });

  it("can get entity usages", async () => {
    const result = await EntityService.getEntityUsages("testIri", 1, 25);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/usages", { params: { iri: "testIri", page: 1, size: 25 } });
    expect(result).toStrictEqual([]);
  });

  it("can get usages total records", async () => {
    const result = await EntityService.getUsagesTotalRecords("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/usagesTotalRecords", { params: { iri: "testIri" } });
    expect(result).toBe(0);
  });

  it("can get entity members", async () => {
    const result = await EntityService.getEntityMembers("testIri", true, true, 1000);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/members", { params: { iri: "testIri", expandMembers: true, expandSubsets: true, limit: 1000 } });
    expect(result).toStrictEqual({});
  });

  it("can get entity graph", async () => {
    const result = await EntityService.getEntityGraph("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/graph", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can get entity term codes", async () => {
    const result = await EntityService.getEntityTermCodes("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/termCode", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can get partial bundle", async () => {
    const result = await EntityService.getPartialEntityBundle("testIri", ["testPredicate1", "testPredicate2"]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/partialBundle", { params: { iri: "testIri", predicate: "testPredicate1,testPredicate2" } });
    expect(result).toStrictEqual({});
  });

  it("can getInferredBundle", async () => {
    const result = await EntityService.getDefinitionBundle("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/inferredBundle", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can getInferredAsString", async () => {
    const result = await EntityService.getInferredAsString("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/inferredAsString", { params: { iri: "testIri" } });
    expect(result).toBe("");
  });

  it("can getAxiomBundle", async () => {
    const result = await EntityService.getAxiomBundle("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/axiomBundle", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can getAxiomAsString", async () => {
    const result = await EntityService.getAxiomAsString("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/axiomAsString", { params: { iri: "testIri" } });
    expect(result).toBe("");
  });

  it("can get data model properties", async () => {
    const result = await EntityService.getDataModelProperties("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/dataModelProperties", { params: { iri: "testIri" } });
    expect(result).toStrictEqual([]);
  });

  it("can get entity summary", async () => {
    const result = await EntityService.getEntitySummary("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/summary", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  //obsolete, to be deleted on editor branch merge
  it("can get entity", async () => {
    const result = await EntityService.getEntity("testIri");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity", { params: { iri: "testIri" } });
    expect(result).toStrictEqual({});
  });

  it("can get get namespaces", async () => {
    const result = await EntityService.getNamespaces();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/namespaces");
    expect(result).toStrictEqual([]);
  });

  it("can get ECLSearch", async () => {
    const cancelToken = axios.CancelToken.source().token;
    const result = await EntityService.ECLSearch("testString", false, 1000, cancelToken);
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(api + "api/set/eclSearch", "testString", {
      headers: { "Content-Type": "text/plain" },
      params: { includeLegacy: false, limit: 1000 },
      cancelToken: cancelToken
    });
    expect(result).toStrictEqual({});
  });

  it("can getMatchedFrom", async () => {
    const result = await EntityService.getMatchedFrom("testString");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(api + "api/entity/matchedFrom", { params: { iri: "testString" } });
    expect(result).toStrictEqual([]);
  });
});
