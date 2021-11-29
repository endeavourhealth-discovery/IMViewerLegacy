import { flushPromises, shallowMount } from "@vue/test-utils";
import Members from "@/components/concept/Members.vue";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import Button from "primevue/button";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import Menu from "primevue/menu";

describe("Members.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let mockRef: any;
  let docSpy: any;
  let testMembers = {
    valueSet: {
      name: "CEG 16+1 Ethnic category (concept set)",
      "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16"
    },
    members: [
      {
        entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
        code: "15086000",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
        code: "413464008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
        code: "88790004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
        code: "92491000000104",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
        code: "160514004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      }
    ],
    limited: false
  };

  let testCombinedMembers = [
    {
      entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
      code: "15086000",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: 'Subset - "other Black, African or Caribbean background"',
      type: "SUBSET",
      directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
    },
    {
      entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
      code: "413464008",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: 'Subset - "other Black, African or Caribbean background"',
      type: "SUBSET",
      directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
    },
    {
      entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
      code: "88790004",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: "Subset - African",
      type: "SUBSET",
      directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
    },
    {
      entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
      code: "92491000000104",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: "Subset - African",
      type: "SUBSET",
      directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
    },
    {
      entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
      code: "160514004",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: "Subset - African",
      type: "SUBSET",
      directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
    }
  ];

  beforeEach(async () => {
    jest.resetAllMocks();

    EntityService.getEntityMembers = jest.fn().mockResolvedValue(testMembers);
    mockRouter = { push: jest.fn() };
    mockToast = { add: jest.fn() };
    mockRef = { render: () => {}, methods: { toggle: jest.fn() } };

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    const warn = console.warn;
    console.warn = jest.fn();

    const error = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(Members, {
      global: {
        components: { DataTable, InputText, Checkbox, Column, Button, Menu },
        mocks: { $router: mockRouter, $toast: mockToast },
        stubs: { DataTable: DataTable, Menu: mockRef }
      },
      props: { conceptIri: "http://endhealth.info/im#VSET_EthnicCategoryCEG16" }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();

    console.warn = warn;
    console.error = error;
  });

  it("mounts", () => {
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.members).toStrictEqual(testMembers);
    expect(wrapper.vm.combinedMembers).toStrictEqual(testCombinedMembers);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual(['Subset - "other Black, African or Caribbean background"', "Subset - African"]);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]);
    expect(wrapper.vm.downloadMenu).toHaveLength(3);
    expect(wrapper.vm.downloadMenu[0].label).toBe("Definition");
    expect(wrapper.vm.downloadMenu[1].label).toBe("Expanded (v2)");
    expect(wrapper.vm.downloadMenu[2].label).toBe("Expanded (v1)");
  });

  it("can run downloadMenu commands", () => {
    wrapper.vm.download = jest.fn();
    wrapper.vm.downloadMenu[0].command();
    expect(wrapper.vm.download).toHaveBeenLastCalledWith(false);
    wrapper.vm.downloadMenu[1].command();
    expect(wrapper.vm.download).toHaveBeenLastCalledWith(true);
    wrapper.vm.downloadMenu[2].command();
    expect(wrapper.vm.download).toHaveBeenLastCalledWith(true, true);
  });

  it("adds event listener to setTableWidth on resize", async () => {
    console.error = jest.fn();
    await flushPromises();
    const spy = jest.spyOn(wrapper.vm, "setTableWidth");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it("can remove eventListener", () => {
    console.error = jest.fn();
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });

  it("can resize", () => {
    console.error = jest.fn();
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onResize();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can watch conceptIri", async () => {
    wrapper.vm.getMembers = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#92491000000104");
    expect(wrapper.vm.getMembers).toHaveBeenCalledTimes(1);
  });

  it("can set width onRowGroupExpand", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onRowGroupExpand();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can set width onRowGroupExpand", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onRowGroupCollapse();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can getMembers ___ success", async () => {
    wrapper.vm.members = {};
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.sortMembers = jest.fn();
    wrapper.vm.setSubsets = jest.fn();
    wrapper.vm.getMembers();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual([]);
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://endhealth.info/im#VSET_EthnicCategoryCEG16", false, false, 2000);
    await flushPromises();
    expect(wrapper.vm.members).toStrictEqual(testMembers);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.sortMembers).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.setSubsets).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.combinedMembers).toStrictEqual(testCombinedMembers);
  });

  it("can setSubsets", async () => {
    wrapper.vm.combinedMembers.push({
      entity: { name: "Gambians (ethnic group)", "@id": "http://snomed.info/sct#90822005" },
      code: "90822005",
      scheme: { name: "Snomed-CT code", "@id": "http://endhealth.info/im#SnomedCodeScheme" },
      label: "Subset - African",
      type: "MemberIncluded",
      directParent: {
        name: "African",
        "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N"
      }
    });
    wrapper.vm.combinedMembers.push({
      entity: {
        name: "Advice given about severe acute respiratory syndrome coronavirus 2 infection (situation)",
        "@id": "http://snomed.info/sct#1240721000000105"
      },
      code: "1240721000000105",
      scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
      label: "a_MemberIncluded",
      type: "INCLUDED",
      directParent: { name: "Advice or consultation about Covid value set", "@id": "http://endhealth.info/im#CSET_Covid5" }
    });
    wrapper.vm.subsets = [];
    await wrapper.vm.$nextTick();
    wrapper.vm.setSubsets();
    expect(wrapper.vm.subsets).toStrictEqual(['Subset - "other Black, African or Caribbean background"', "Subset - African"]);
  });

  it("can download ___ success", () => {
    const openStore = window.open;
    window.open = jest.fn().mockReturnValue(true);
    wrapper.vm.download(true);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/test/api/set/download?iri=http:%2F%2Fendhealth.info%2Fim%23VSET_EthnicCategoryCEG16&expandMembers=true&v1=false&format=excel"
    );
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Download will begin shortly"));
    window.open = openStore;
  });

  it("can download ___ success ___ v1", () => {
    const openStore = window.open;
    window.open = jest.fn().mockReturnValue(true);
    wrapper.vm.download(true, true);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/test/api/set/download?iri=http:%2F%2Fendhealth.info%2Fim%23VSET_EthnicCategoryCEG16&expandMembers=true&v1=true&format=excel"
    );
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Download will begin shortly"));
    window.open = openStore;
  });

  it("can download ___ fail", () => {
    const openStore = window.open;
    window.open = jest.fn().mockReturnValue(false);
    wrapper.vm.download(true);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/test/api/set/download?iri=http:%2F%2Fendhealth.info%2Fim%23VSET_EthnicCategoryCEG16&expandMembers=true&v1=false&format=excel"
    );
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Download failed from server"));
    window.open = openStore;
  });

  it("can sort members ___ correct data", () => {
    wrapper.vm.members.members = [
      {
        entity: { name: "Asian race (racial group)", "@id": "http://snomed.info/sct#413582008" },
        code: "413582008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - any other Asian background",
        type: "SUBSET",
        directParent: { name: "any other Asian background", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_L" }
      },
      {
        entity: { name: "Mozambiquans (ethnic group)", "@id": "http://snomed.info/sct#41076003" },
        code: "41076003",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "Black, other, non-mixed origin (ethnic group)", "@id": "http://snomed.info/sct#185989004" },
        code: "185989004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      }
    ];
    wrapper.vm.sortMembers();
    expect(wrapper.vm.members.members).toStrictEqual([
      {
        entity: { name: "Black, other, non-mixed origin (ethnic group)", "@id": "http://snomed.info/sct#185989004" },
        code: "185989004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "Mozambiquans (ethnic group)", "@id": "http://snomed.info/sct#41076003" },
        code: "41076003",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "Asian race (racial group)", "@id": "http://snomed.info/sct#413582008" },
        code: "413582008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - any other Asian background",
        type: "SUBSET",
        directParent: { name: "any other Asian background", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_L" }
      }
    ]);
  });

  it("can sort members ___ incorrect data", () => {
    wrapper.vm.members.members = [];
    wrapper.vm.sortMembers();
    expect(wrapper.vm.members.members).toStrictEqual([]);
  });

  it("resizes", async () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onResize();
    await flushPromises();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can setTableWidth", () => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ width: 100 });
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    mockElement.style.width = "10px";
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setTableWidth();
    expect(mockElement.style.width).not.toBe("10px");
  });

  it("can setTableWidth ___ table fail", () => {
    LoggerService.error = jest.fn();
    docSpy.mockReturnValue(undefined);
    wrapper.vm.setTableWidth();
    expect(LoggerService.error).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenCalledWith(undefined, "Failed to set members table width. Required element(s) not found.");
  });

  it("can toggle", () => {
    wrapper.vm.toggle("testEvent");
    expect(mockRef.methods.toggle).toHaveBeenCalledTimes(1);
    expect(mockRef.methods.toggle).toHaveBeenCalledWith("testEvent");
  });
});
