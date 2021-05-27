import { shallowMount } from "@vue/test-utils";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Column from "primevue/column";
import IndividualService from "@/services/IndividualService";
import LoggerService from "@/services/LoggerService";

describe("ReportTable.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;

  beforeEach(() => {
    jest.clearAllMocks();
    IndividualService.getConceptCategoryReport = jest.fn().mockResolvedValue({
      status: 200,
      data: {
          "@id": "http://endhealth.info/im#ontologyOverview",
          "http://endhealth.info/im#hasStatsReportEntry": [{
              "http://www.w3.org/2002/07/owl#hasValue": {
                  "@value": "8",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              },
              "http://www.w3.org/2000/01/rdf-schema#label": {
                  "@value": "Value sets",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              }
          }, {
              "http://www.w3.org/2002/07/owl#hasValue": {
                  "@value": "1973",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              },
              "http://www.w3.org/2000/01/rdf-schema#label": {
                  "@value": "Data models",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              }
          }, {
              "http://www.w3.org/2002/07/owl#hasValue": {
                  "@value": "1124984",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              },
              "http://www.w3.org/2000/01/rdf-schema#label": {
                  "@value": "Ontology",
                  "@type": "http://www.w3.org/2001/XMLSchema#string"
              }
          }
          ],
          "http://www.w3.org/2000/01/rdf-schema#comment": {
              "@value": "A brief overview of the concepts stored in the Ontology",
              "@type": "http://www.w3.org/2001/XMLSchema#string"
          },
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
              "@id": "http://endhealth.info/im#statsReport",
              "name": "Statistics Report"
          },
          "http://www.w3.org/2000/01/rdf-schema#label": {
              "@value": "Ontology overview",
              "@type": "http://www.w3.org/2001/XMLSchema#string"
          }
      }
    });
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    wrapper = shallowMount(ReportTable, {
      global: {
        components: { Card, DataTable, ProgressSpinner, Column },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    });
  });

  it("sets loading for mounted", () => {
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", { key: "reportCategory", value: true });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportCategory", value: false });
  });

  it("calls reportService.getConceptCategoryReport", () => {
    expect(IndividualService.getConceptCategoryReport).toHaveBeenCalledTimes(1);
  });

  it("updates tableData from service call", () => {
    expect(wrapper.vm.tableData).toEqual([{"label":"Value sets","count":8},{"label":"Data models","count":1975},{"label":"Ontology","count":1123680},{"label":"Total","count":1125663}]);
  });
});

describe("service fail", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;
  let testError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    testError = new Error("deliberate test error");
    IndividualService.getConceptCategoryReport = jest.fn().mockRejectedValue({
      status: 400,
      error: testError
    });
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    LoggerService.error = jest.fn();
    wrapper = shallowMount(ReportTable, {
      global: {
        components: { Card, DataTable, ProgressSpinner, Column },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    });
  });

  it("launches a toast on service call error", () => {
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenLastCalledWith("Ontology Overview server request failed", { status: 400, error: testError });
  });
})
