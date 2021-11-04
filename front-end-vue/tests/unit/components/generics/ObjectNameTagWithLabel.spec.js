import ObjectNameTagWithLabel from "@/components/generics/ObjectNameTagWithLabel.vue";
import { shallowMount } from "@vue/test-utils";
import Tag from "primevue/tag";
import LoggerService from "@/services/LoggerService";

describe("ObjectNameTagWithLabel.vue", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(ObjectNameTagWithLabel, {
      global: { components: { Tag } },
      props: { label: "Status", data: { "@id": "http://endhealth.info/im#Active", name: "Active" }, size: "100%" }
    });
  });

  describe("isObjectWithName", () => {
    it("returns true if object with name", () => {
      expect(ObjectNameTagWithLabel.computed.isObjectWithName.call({ data: { "@id": "http://endhealth.info/im#Active", name: "Active" } })).toBe(true);
    });

    it("returns false if not object with name", () => {
      LoggerService.error = jest.fn();
      expect(ObjectNameTagWithLabel.computed.isObjectWithName.call({ data: "Name" })).toBe(false);
      expect(LoggerService.error).toHaveBeenCalledTimes(1);
      expect(LoggerService.error).toHaveBeenCalledWith(
        undefined,
        "No data, data is not Object or Object has no property 'name' for use within component ObjectNameTagWithLabel.vue"
      );
    });
  });

  describe("getSeverity", () => {
    it("returns correct severity ___ Active", () => {
      expect(ObjectNameTagWithLabel.computed.getSeverity.call({ data: { "@id": "http://endhealth.info/im#Active", name: "Active" } })).toBe("success");
    });

    it("returns correct severity ___ Draft", () => {
      expect(ObjectNameTagWithLabel.computed.getSeverity.call({ data: { "@id": "http://endhealth.info/im#Draft", name: "Draft" } })).toBe("warning");
    });

    it("returns correct severity ___ Inactive", () => {
      expect(ObjectNameTagWithLabel.computed.getSeverity.call({ data: { "@id": "http://endhealth.info/im#Inactive", name: "Inactive" } })).toBe("danger");
    });

    it("returns correct severity ___ none", () => {
      expect(ObjectNameTagWithLabel.computed.getSeverity.call({ data: null })).toBe("info");
    });
  });
});
