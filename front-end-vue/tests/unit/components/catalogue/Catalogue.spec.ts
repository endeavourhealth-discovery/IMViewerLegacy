import {flushPromises, shallowMount} from "@vue/test-utils";
import Catalogue from "@/views/Catalogue.vue";
import MultiSelect from "primevue/multiselect";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import Tree from "primevue/tree";
import Panel from "primevue/panel";
import Listbox from "primevue/listbox";
import CatalogueDashboard from "@/components/catalogue/CatalogueDashboard.vue";
import SideNav from "@/components/home/SideNav.vue";
import CatalogueService from "@/services/CatalogueService";

describe("Catalogue.vue", () => {
  let wrapper: any;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    };

    CatalogueService.getPartialInstance = jest.fn().mockResolvedValue({
      entity: {
        "@id": "http://org.endhealth.info/im#FQK48",
        "http://endhealth.info/im#address": {
          "@id": "http://loc.endhealth.info/im#FQK48"
        },
        "http://endhealth.info/im#status": {
          "@id": "http://endhealth.info/im#Active",
          name: "Active"
        },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
          "@id": "http://endhealth.info/im#Organisation",
          name: "Organisation  (record type)"
        },
        "http://www.w3.org/2000/01/rdf-schema#label":"EDWALTON PHARMACY"
      },
      predicates: [
        {name: "address", "@id": "http://endhealth.info/im#address"},
        {name: "status", "@id": "http://endhealth.info/im#status"},
        {name: "type", "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},
        {name: "label", "@id": "http://www.w3.org/2000/01/rdf-schema#label"}
      ]
    });

    CatalogueService.getTypesCount = jest.fn().mockResolvedValue([
        {iri: "http://endhealth.info/im#Organisation", label: "Organisation (record type)", count: 267904},
        {iri: "http://endhealth.info/im#Address", label: "Address (record type)", count: 267904}
    ]);

    CatalogueService.getSearchResult = jest.fn().mockResolvedValue([
      {name: "EDWALTON PHARMACY", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#FM871"},
      {name: "EDWALTON PHARMACY", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#FQK48"},
      {name: "EDWALTON PRIMARY SCHOOL", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#EE142348"}
    ]);
    wrapper = shallowMount(Catalogue, {
      global: {
        components: { MultiSelect, Card, InputText, TabPanel, Listbox, TabView, Tree, Panel, CatalogueDashboard, SideNav },
        mocks: { $router: mockRouter }
      }
    });
  });

  it("starts with empty list", () => {
    expect(wrapper.vm.searchResults).toEqual([]);
    expect(wrapper.vm.selected).toEqual({});
  });
  it("only searches with 3 or more characters ___ 0", async() => {
    wrapper.vm.searchRequest = "";
    wrapper.vm.checkKey("Enter");
    expect(CatalogueService.getSearchResult).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.searchResults).toEqual([]);
  });
  it("only searches with 3 or more characters ___ 1", async() => {
    wrapper.vm.searchRequest = "e";
    wrapper.vm.checkKey("Enter");
    expect(CatalogueService.getSearchResult).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.searchResults).toEqual([]);
  });
  it("only searches with 3 or more characters ___ 2", async() => {
    wrapper.vm.searchRequest = "ed";
    wrapper.vm.checkKey("Enter");
    expect(CatalogueService.getSearchResult).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.searchResults).toEqual([]);
  });
  it("only searches with 3 or more characters ___ 3", async() => {
    wrapper.vm.searchRequest = "edw";
    wrapper.vm.checkKey("Enter");
    expect(CatalogueService.getSearchResult).toHaveBeenCalledTimes(1);
    expect(CatalogueService.getSearchResult).toHaveBeenCalledWith("edw",[]);
    await flushPromises();
    expect(wrapper.vm.searchResults).toStrictEqual([
      {name: "EDWALTON PHARMACY", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#FM871"},
      {name: "EDWALTON PHARMACY", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#FQK48"},
      {name: "EDWALTON PRIMARY SCHOOL", iriType: {"@id": "Organisation (record type)"},"@id": "http://org.endhealth.info/im#EE142348"}
    ]);
  });
  it("event not equal Enter", async() => {
    wrapper.vm.searchRequest = "edw";
    wrapper.vm.checkKey("Test");
    expect(wrapper.vm.searchResults).toEqual([]);
  });
  it("call getTypesCount on mounted", async() => {
    expect(CatalogueService.getTypesCount).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.vm.types).toStrictEqual([
      {iri: "http://endhealth.info/im#Organisation", label: "Organisation (record type)", count: 267904},
      {iri: "http://endhealth.info/im#Address", label: "Address (record type)", count: 267904}
    ])
  });
  it("set type iris", () => {
    wrapper.vm.selectedType = [
      {count: 267904, iri: "http://endhealth.info/im#Organisation", label: "Organisation  (record type)"},
      {count: 267904, iri: "http://endhealth.info/im#Address", label: "Address (record type)"}
    ];
    wrapper.vm.setIris();
    expect(wrapper.vm.typesIris).toStrictEqual(["http://endhealth.info/im#Organisation", "http://endhealth.info/im#Address"]);
  });
  it("set selected instance --- selected null", () => {
    wrapper.vm.selected = null;
    wrapper.vm.currentSelected = {"@id":"http://org.endhealth.info/im#FM871"};
    wrapper.vm.setSelectedInstance();
    expect(wrapper.vm.selected).toStrictEqual({"@id":"http://org.endhealth.info/im#FM871"});
  });
  it("get tree data", async() => {
    wrapper.vm.instanceIri = "http://org.endhealth.info/im#FQK48";
    wrapper.vm.getPartialInstance();
    await wrapper.vm.$nextTick();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(CatalogueService.getPartialInstance).toHaveBeenCalledTimes(1);
    expect(CatalogueService.getPartialInstance).toHaveBeenCalledWith("http://org.endhealth.info/im#FQK48",[]);
    await flushPromises();
    expect(wrapper.vm.instanceData).toStrictEqual([
      {
        children: [],
        key: 0,
        label:"http://org.endhealth.info/im#FQK48"
      },
      {
        children: [],
        data: { "@id":"http://loc.endhealth.info/im#FQK48" },
        key: 1,
        label:"address : ",
        type:"address"
      },
      {
        children: [],
        data: "Active",
        key: 2,
        label:"status : "
      },
      {
        children: [],
        data: "Organisation  (record type)",
        key: 3,
        label:"type : "
      },
      {
        children: [],
        data: "EDWALTON PHARMACY",
        key: 4,
        label:"label : "
      }
    ]);
  });
  it("navigate --- name null", () => {
    const instance = { "@id": "http://loc.endhealth.info/im#FQK48" };
    wrapper.vm.navigate(instance);
    expect(wrapper.vm.instanceName).toStrictEqual("http://loc.endhealth.info/im#FQK48");
  });
});