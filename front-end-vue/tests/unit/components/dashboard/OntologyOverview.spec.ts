import { shallowMount } from "@vue/test-utils";
import OntologyOverview from "@/components/dashboard/OntologyOverview.vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Column from "primevue/column";
import ReportService from "@/services/ReportService";
import LoggerService from "@/services/LoggerService";

describe("OntologyOverview.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;

  beforeEach(() => {
    jest.clearAllMocks();
    ReportService.getConceptCategoryReport = jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
            "label": "Value sets",
            "count": 8
        },
        {
            "label": "Data models",
            "count": 1975
        },
        {
            "label": "Ontology",
            "count": 1123680
        },
        {
            "label": "Total",
            "count": 1125663
        }
      ]
    });
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    wrapper = shallowMount(OntologyOverview, {
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
    expect(ReportService.getConceptCategoryReport).toHaveBeenCalledTimes(1);
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
    ReportService.getConceptCategoryReport = jest.fn().mockRejectedValue({
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
    wrapper = shallowMount(OntologyOverview, {
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
