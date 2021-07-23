import { flushPromises, shallowMount } from "@vue/test-utils";
import Members from "@/components/concept/Members.vue";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import EntityService from "@/services/EntityService";
import { FilterMatchMode } from "primevue/api";

describe("Members.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let docSpy: any;

  beforeEach(async() => {
    jest.resetAllMocks();

    EntityService.getEntityMembers = jest.fn().mockResolvedValue({ data: {
      "valueSet":{
        "name":"CEG 16+1 Ethnic category (concept set)","@id":"http://endhealth.info/im#VSET_EthnicCategoryCEG16"
      },
      "members":[
        {"entity":{"name":"African American (ethnic group)","@id":"http://snomed.info/sct#15086000"},"code":"15086000","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - \"other Black, African or Caribbean background\""},
        {"entity":{"name":"African race (racial group)","@id":"http://snomed.info/sct#413464008"},"code":"413464008","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - \"other Black, African or Caribbean background\""},
        {"entity":{"name":"Abyssinians (Amharas) (ethnic group)","@id":"http://snomed.info/sct#88790004"},"code":"88790004","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"},
        {"entity":{"name":"African - ethnic category 2001 census (finding)","@id":"http://snomed.info/sct#92491000000104"},"code":"92491000000104","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"},
        {"entity":{"name":"African origin (finding)","@id":"http://snomed.info/sct#160514004"},"code":"160514004","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"}
      ],
      "limited":false
    }});
    mockRouter = { push: jest.fn() };
    mockToast = { add: jest.fn() };

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    const warn = console.warn;
    console.warn = jest.fn();

    const error = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(Members, {
      global: {
        components: { DataTable, InputText, Checkbox, Column },
        mocks: { $router: mockRouter, $toast: mockToast }
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
    expect(wrapper.vm.members).toStrictEqual({
      "valueSet":{
        "name":"CEG 16+1 Ethnic category (concept set)","@id":"http://endhealth.info/im#VSET_EthnicCategoryCEG16"
      },
      "members":[
        {"entity":{"name":"African American (ethnic group)","@id":"http://snomed.info/sct#15086000"},"code":"15086000","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - \"other Black, African or Caribbean background\""},
        {"entity":{"name":"African race (racial group)","@id":"http://snomed.info/sct#413464008"},"code":"413464008","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - \"other Black, African or Caribbean background\""},
        {"entity":{"name":"Abyssinians (Amharas) (ethnic group)","@id":"http://snomed.info/sct#88790004"},"code":"88790004","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"},
        {"entity":{"name":"African - ethnic category 2001 census (finding)","@id":"http://snomed.info/sct#92491000000104"},"code":"92491000000104","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"},
        {"entity":{"name":"African origin (finding)","@id":"http://snomed.info/sct#160514004"},"code":"160514004","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"Subset - African"}
      ],
      "limited":false
    });
    expect(wrapper.vm.combinedMembers).toStrictEqual([{"code": "15086000", "entity": {"@id": "http://snomed.info/sct#15086000", "name": "African American (ethnic group)"}, "scheme": {"@id": "http://endhealth.info/im#SnomedCodeScheme", "name": "Snomed-CT code"}, "type": "Subset - \"other Black, African or Caribbean background\""}, {"code": "413464008", "entity": {"@id": "http://snomed.info/sct#413464008", "name": "African race (racial group)"}, "scheme": {"@id": "http://endhealth.info/im#SnomedCodeScheme", "name": "Snomed-CT code"}, "type": "Subset - \"other Black, African or Caribbean background\""}, {"code": "88790004", "entity": {"@id": "http://snomed.info/sct#88790004", "name": "Abyssinians (Amharas) (ethnic group)"}, "scheme": {"@id": "http://endhealth.info/im#SnomedCodeScheme", "name": "Snomed-CT code"}, "type": "Subset - African"}, {"code": "92491000000104", "entity": {"@id": "http://snomed.info/sct#92491000000104", "name": "African - ethnic category 2001 census (finding)"}, "scheme": {"@id": "http://endhealth.info/im#SnomedCodeScheme", "name": "Snomed-CT code"}, "type": "Subset - African"}, {"code": "160514004", "entity": {"@id": "http://snomed.info/sct#160514004", "name": "African origin (finding)"}, "scheme": {"@id": "http://endhealth.info/im#SnomedCodeScheme", "name": "Snomed-CT code"}, "type": "Subset - African"}]);
    expect(wrapper.vm.filters1).toStrictEqual({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    expect(wrapper.vm.expandMembers).toBe(false);
    expect(wrapper.vm.expandSubsets).toBe(false);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual(["Subset - \"other Black, African or Caribbean background\"", "Subset - African"]);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["MemberIncluded", "MemberXcluded"]);
  });
});
