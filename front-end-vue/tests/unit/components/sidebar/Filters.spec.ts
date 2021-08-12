import { flushPromises, mount } from "@vue/test-utils";
import Filters from "@/components/sidebar/Filters.vue";
import MultiSelect from "primevue/multiselect";
import InputSwitch from "primevue/inputswitch";
import ConfigService from "@/services/ConfigService";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("Filters.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;

  beforeEach(async() => {
    mockStore = {
      state: {
        selectedFilters: {
          status: [],
          schemes: [],
          types: []
        },
        filterOptions: {
          status: [],
          schemes: [],
          types: []
        },
        quickFiltersStatus: {  }
      },
      commit: jest.fn()
    };

    mockToast = { add: jest.fn() };

    ConfigService.getFilterDefaults = jest.fn().mockResolvedValue({ data: {
      "schemeOptions": [
        "Discovery namespace",
        "Snomed-CT namespace"
      ],
      "statusOptions": [
        "Active",
        "Draft"
      ],
      "typeOptions": [
        "Class",
        "Concept Set",
        "Folder",
        "Node shape",
        "ObjectProperty",
        "Property",
        "Query template",
        "Record type",
        "Value set"
      ]
    }});

    EntityService.getNamespaces = jest.fn().mockResolvedValue({ data: [{"iri":"http://endhealth.info/bc#","prefix":"bc","name":"Barts Cerner namespace"},{"iri":"http://endhealth.info/ceg16#","prefix":"ceg13","name":"CEG ethnicity 16+ category"},{"iri":"http://endhealth.info/im#","prefix":"im","name":"Discovery namespace"},{"iri":"http://endhealth.info/emis#","prefix":"emis","name":"EMIS (inc. Read2 like) namespace"},{"iri":"http://endhealth.info/icd10#","prefix":"icd10","name":"ICD10 namespace"},{"iri":"http://endhealth.info/reports#","prefix":"reports","name":"IM internal reports"},{"iri":"http://endhealth.info/kchapex#","prefix":"kchapex","name":"KCH Apex codes"},{"iri":"http://endhealth.info/kchwinpath#","prefix":"kchwinpath","name":"KCH Winpath codes"},{"iri":"http://endhealth.info/nhsethnic2001#","prefix":"nhse2001","name":"NHS Ethnicitity categories 2001 census"},{"iri":"http://endhealth.info/ods#","prefix":"ods","name":"ODS code scheme"},{"iri":"http://endhealth.info/opcs4#","prefix":"opcs4","name":"OPCS4 namespace"},{"iri":"https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#","prefix":"orole","name":"OPS roles namespace"},{"iri":"http://www.w3.org/2002/07/owl#","prefix":"owl","name":"OWL2 namespace"},{"iri":"http://www.w3.org/ns/prov#","prefix":"prov","name":"PROV namespace"},{"iri":"http://endhealth.info/prsb#","prefix":"prsb","name":"PRSB namespace"},{"iri":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","prefix":"rdf","name":"RDF namespace"},{"iri":"http://www.w3.org/2000/01/rdf-schema#","prefix":"rdfs","name":"RDFS namespace"},{"iri":"http://www.w3.org/ns/shacl#","prefix":"sh","name":"SHACL namespace"},{"iri":"http://snomed.info/sct#","prefix":"sn","name":"Snomed-CT namespace"},{"iri":"http://endhealth.info/tpp#","prefix":"tpp","name":"TPP (inc.CTV3) namespace"},{"iri":"http://endhealth.info/vision#","prefix":"vis","name":"Vision (incl. Read2) namespace"},{"iri":"http://www.w3.org/2001/XMLSchema#","prefix":"xsd","name":"xsd namespace"}]});

    EntityService.getEntityChildren = jest.fn().mockResolvedValueOnce({ data: [{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"},{"name":"Inactive","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Inactive"}] })
    .mockResolvedValueOnce({ data: [{"name":"Class","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#Class"},{"name":"Concept Set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ConceptSet"},{"name":"Folder","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Folder"},{"name":"Node shape","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"ObjectProperty","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#ObjectProperty"},{"name":"Property","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2000/01/rdf-schema#Class"}],"@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"name":"Query template","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#QueryTemplate"},{"name":"Record type","hasChildren":false,"type":[{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"}],"@id":"http://endhealth.info/im#RecordType"},{"name":"Value set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ValueSet"}]});

    wrapper = mount(Filters, {
      props: { search: jest.fn(), searchTerm: "sco" },
      global: {
        components: { MultiSelect, InputSwitch },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    });

    await flushPromises();
  });
  it("sets data on mount", () => {
    expect(wrapper.vm.statusOptions).toStrictEqual([{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"},{"name":"Inactive","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Inactive"}]);
    expect(wrapper.vm.schemeOptions).toStrictEqual([{"iri":"http://endhealth.info/bc#","prefix":"bc","name":"Barts Cerner namespace"},{"iri":"http://endhealth.info/ceg16#","prefix":"ceg13","name":"CEG ethnicity 16+ category"},{"iri":"http://endhealth.info/im#","prefix":"im","name":"Discovery namespace"},{"iri":"http://endhealth.info/emis#","prefix":"emis","name":"EMIS (inc. Read2 like) namespace"},{"iri":"http://endhealth.info/icd10#","prefix":"icd10","name":"ICD10 namespace"},{"iri":"http://endhealth.info/reports#","prefix":"reports","name":"IM internal reports"},{"iri":"http://endhealth.info/kchapex#","prefix":"kchapex","name":"KCH Apex codes"},{"iri":"http://endhealth.info/kchwinpath#","prefix":"kchwinpath","name":"KCH Winpath codes"},{"iri":"http://endhealth.info/nhsethnic2001#","prefix":"nhse2001","name":"NHS Ethnicitity categories 2001 census"},{"iri":"http://endhealth.info/ods#","prefix":"ods","name":"ODS code scheme"},{"iri":"http://endhealth.info/opcs4#","prefix":"opcs4","name":"OPCS4 namespace"},{"iri":"https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#","prefix":"orole","name":"OPS roles namespace"},{"iri":"http://www.w3.org/2002/07/owl#","prefix":"owl","name":"OWL2 namespace"},{"iri":"http://www.w3.org/ns/prov#","prefix":"prov","name":"PROV namespace"},{"iri":"http://endhealth.info/prsb#","prefix":"prsb","name":"PRSB namespace"},{"iri":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","prefix":"rdf","name":"RDF namespace"},{"iri":"http://www.w3.org/2000/01/rdf-schema#","prefix":"rdfs","name":"RDFS namespace"},{"iri":"http://www.w3.org/ns/shacl#","prefix":"sh","name":"SHACL namespace"},{"iri":"http://snomed.info/sct#","prefix":"sn","name":"Snomed-CT namespace"},{"iri":"http://endhealth.info/tpp#","prefix":"tpp","name":"TPP (inc.CTV3) namespace"},{"iri":"http://endhealth.info/vision#","prefix":"vis","name":"Vision (incl. Read2) namespace"},{"iri":"http://www.w3.org/2001/XMLSchema#","prefix":"xsd","name":"xsd namespace"}]);
    expect(wrapper.vm.typeOptions).toStrictEqual([{"name":"Class","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#Class"},{"name":"Concept Set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ConceptSet"},{"name":"Folder","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Folder"},{"name":"Node shape","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"ObjectProperty","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#ObjectProperty"},{"name":"Property","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2000/01/rdf-schema#Class"}],"@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"name":"Query template","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#QueryTemplate"},{"name":"Record type","hasChildren":false,"type":[{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"}],"@id":"http://endhealth.info/im#RecordType"},{"name":"Value set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ValueSet"}]);
    expect(wrapper.vm.configs).toStrictEqual({"schemeOptions":["Discovery namespace","Snomed-CT namespace"],"statusOptions":["Active","Draft"],"typeOptions":["Class","Concept Set","Folder","Node shape","ObjectProperty","Property","Query template","Record type","Value set"]});
  });

  it("getsFilterOptions ___ pass", async() => {
    EntityService.getEntityChildren = jest.fn().mockResolvedValueOnce({ data: [{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"},{"name":"Inactive","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Inactive"}] })
    .mockResolvedValueOnce({ data: [{"name":"Class","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#Class"},{"name":"Concept Set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ConceptSet"},{"name":"Folder","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Folder"},{"name":"Node shape","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"ObjectProperty","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#ObjectProperty"},{"name":"Property","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2000/01/rdf-schema#Class"}],"@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"name":"Query template","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#QueryTemplate"},{"name":"Record type","hasChildren":false,"type":[{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"}],"@id":"http://endhealth.info/im#RecordType"},{"name":"Value set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ValueSet"}]});
    wrapper.vm.configs = {};
    wrapper.vm.statusOptions = [];
    wrapper.vm.schemeOptions = [];
    wrapper.vm.typeOptions = [];
    wrapper.vm.getFilterOptions();
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.statusOptions).toStrictEqual([{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"},{"name":"Inactive","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Inactive"}]);
    expect(wrapper.vm.schemeOptions).toStrictEqual([{"iri":"http://endhealth.info/bc#","prefix":"bc","name":"Barts Cerner namespace"},{"iri":"http://endhealth.info/ceg16#","prefix":"ceg13","name":"CEG ethnicity 16+ category"},{"iri":"http://endhealth.info/im#","prefix":"im","name":"Discovery namespace"},{"iri":"http://endhealth.info/emis#","prefix":"emis","name":"EMIS (inc. Read2 like) namespace"},{"iri":"http://endhealth.info/icd10#","prefix":"icd10","name":"ICD10 namespace"},{"iri":"http://endhealth.info/reports#","prefix":"reports","name":"IM internal reports"},{"iri":"http://endhealth.info/kchapex#","prefix":"kchapex","name":"KCH Apex codes"},{"iri":"http://endhealth.info/kchwinpath#","prefix":"kchwinpath","name":"KCH Winpath codes"},{"iri":"http://endhealth.info/nhsethnic2001#","prefix":"nhse2001","name":"NHS Ethnicitity categories 2001 census"},{"iri":"http://endhealth.info/ods#","prefix":"ods","name":"ODS code scheme"},{"iri":"http://endhealth.info/opcs4#","prefix":"opcs4","name":"OPCS4 namespace"},{"iri":"https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#","prefix":"orole","name":"OPS roles namespace"},{"iri":"http://www.w3.org/2002/07/owl#","prefix":"owl","name":"OWL2 namespace"},{"iri":"http://www.w3.org/ns/prov#","prefix":"prov","name":"PROV namespace"},{"iri":"http://endhealth.info/prsb#","prefix":"prsb","name":"PRSB namespace"},{"iri":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","prefix":"rdf","name":"RDF namespace"},{"iri":"http://www.w3.org/2000/01/rdf-schema#","prefix":"rdfs","name":"RDFS namespace"},{"iri":"http://www.w3.org/ns/shacl#","prefix":"sh","name":"SHACL namespace"},{"iri":"http://snomed.info/sct#","prefix":"sn","name":"Snomed-CT namespace"},{"iri":"http://endhealth.info/tpp#","prefix":"tpp","name":"TPP (inc.CTV3) namespace"},{"iri":"http://endhealth.info/vision#","prefix":"vis","name":"Vision (incl. Read2) namespace"},{"iri":"http://www.w3.org/2001/XMLSchema#","prefix":"xsd","name":"xsd namespace"}]);
    expect(wrapper.vm.typeOptions).toStrictEqual([{"name":"Class","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#Class"},{"name":"Concept Set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ConceptSet"},{"name":"Folder","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Folder"},{"name":"Node shape","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"ObjectProperty","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://www.w3.org/2002/07/owl#ObjectProperty"},{"name":"Property","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2000/01/rdf-schema#Class"}],"@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"},{"name":"Query template","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#QueryTemplate"},{"name":"Record type","hasChildren":false,"type":[{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"}],"@id":"http://endhealth.info/im#RecordType"},{"name":"Value set","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#ValueSet"}]);
    expect(wrapper.vm.configs).toStrictEqual({"schemeOptions":["Discovery namespace","Snomed-CT namespace"],"statusOptions":["Active","Draft"],"typeOptions":["Class","Concept Set","Folder","Node shape","ObjectProperty","Property","Query template","Record type","Value set"]});
  });

  it("getsFilterOptions ___ fail", async() => {
    ConfigService.getFilterDefaults = jest.fn().mockRejectedValue(false);
    EntityService.getNamespaces = jest.fn().mockRejectedValue(false);
    EntityService.getEntityChildren = jest.fn().mockRejectedValue(false);
    wrapper.vm.getFilterOptions();
    await flushPromises();
    expect(mockToast.add).toHaveBeenCalledTimes(4);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get filter configs from server"));
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get scheme filter options from server"));
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get status filter options from server"));
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get type filter options from server"));
  });

  it("can check for search", () => {
    wrapper.vm.checkForSearch();
    expect(wrapper.vm.search).toHaveBeenCalled();
  });

  it("can check for search ___ no searchterm", async() => {
    await wrapper.setProps({ searchTerm: "" });
    wrapper.vm.checkForSearch();
    expect(wrapper.vm.search).not.toHaveBeenCalled();
  });
})
