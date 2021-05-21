import { shallowMount } from "@vue/test-utils";
import ConceptStatus from "@/components/dashboard/ConceptStatus.vue";
import Card from "primevue/card";
import Chart from "primevue/chart";
import ProgressSpinner from "primevue/progressspinner";
import ReportService from "@/services/ReportService";
import LoggerService from "@/services/LoggerService";
import { ChartOptions } from "@/models/charts/ChartOptions";
import { PieChartData } from "@/models/charts/PieChartData";

describe("ConceptSchemes.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;

  beforeEach(() => {
    jest.clearAllMocks();
    ReportService.getConceptStatusReport = jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
            "iri": "http://endhealth.info/im#Active",
            "label": "Active",
            "count": 845264
        },
        {
            "iri": "http://endhealth.info/im#Inactive",
            "label": "Inactive",
            "count": 283694
        },
        {
            "iri": "http://endhealth.info/im#Draft",
            "label": "Draft",
            "count": 1293
        }
      ]
    });
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    const testChartOptions = {
      legend: {
        position: "right",
        onHover: function(e: any) {
          e.target.style.cursor = "pointer";
        }
      },
      hover: {
        onHover: function(e: any) {
          e.target.style.cursor = "default";
        }
      }
    };
    wrapper = shallowMount(ConceptStatus, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("sets the store loading over mount", async() => {
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", { key: "reportStatus", value: true });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportStatus", value: false })
  });

  it("calls the report service on mount", () => {
    expect(ReportService.getConceptStatusReport).toBeCalledTimes(1);
  });

  it("processes api return into realData, updatedChartOptions and chartConceptSchemes", async() => {
    const testChartConceptStatus = {
      datasets: [
        {
          backgroundColor: [
            "#781c81",
            "#83ba6d",
            "#d92120"
          ],
          borderRadius: 1,
          data: [
            629408.525625,
            211922.0625,
            6357.661875
          ],
          hoverBackgroundColor: [
            "#bc8ec0",
            "#c1ddb6",
            "#ec9090"
          ]
        }
      ],
      labels: [
        "Active",
        "Inactive",
        "Draft"
      ]
    };
    const testChartOptions = {
      legend: {
        position: "right",
        onHover: function(e: any) {

        }
      },
      hover: {
        onHover: function(e: any) {

        }
      },
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {

          }
        }
      }
    };
    expect(wrapper.vm.chartConceptStatus).toEqual(testChartConceptStatus);
    expect(wrapper.vm.realData).toStrictEqual({ 0: 845264, 1: 283694, 2: 1293 });
    expect(wrapper.vm.updatedChartOptions.toString()).toEqual(testChartOptions.toString()
    );
  });

  it("can setChartColours", async() => {
    const testData = [
      {
          "iri": "http://endhealth.info/im#Active",
          "label": "Active",
          "count": 845264
      },
      {
          "iri": "http://endhealth.info/im#Inactive",
          "label": "Inactive",
          "count": 283694
      },
      {
          "iri": "http://endhealth.info/im#Draft",
          "label": "Draft",
          "count": 1293
      }
    ];
    wrapper.vm.chartConceptStatus = new PieChartData(
      [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderRadius: 1
        }
      ],
      []
    ) as PieChartData;
    const mockRes = [
      {
          "iri": "http://endhealth.info/im#Active",
          "label": "Active",
          "count": 845264
      },
      {
          "iri": "http://endhealth.info/im#Inactive",
          "label": "Inactive",
          "count": 283694
      },
      {
          "iri": "http://endhealth.info/im#Draft",
          "label": "Draft",
          "count": 1293
      }
    ];
    wrapper.vm.setChartColours(mockRes);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartConceptStatus).toEqual({
      datasets:[{
        "data":[],
        "backgroundColor":["#781c81","#83ba6d","#d92120"],
        "hoverBackgroundColor":["#bc8ec0","#c1ddb6","#ec9090"],"borderRadius":1
      }],
      labels: []
    });
  })
});

describe("service fail", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;
  let testError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    testError = new Error("concept status deliberate test error")
    ReportService.getConceptStatusReport = jest.fn().mockRejectedValue({ status: 400, error: testError });
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    LoggerService.error = jest.fn()
    const testChartOptions = {
      legend: {
        position: "right",
        onHover: function(e: any) {
          e.target.style.cursor = "pointer";
        }
      },
      hover: {
        onHover: function(e: any) {
          e.target.style.cursor = "default";
        }
      }
    };
    wrapper = shallowMount(ConceptStatus, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("fires a toast message on service error and stops loading", () => {
    expect(ReportService.getConceptStatusReport).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportStatus", value: false });
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept status server request failed", testError));
    expect(LoggerService.error).toHaveBeenCalledTimes(2);
    expect(LoggerService.error).toHaveBeenLastCalledWith("Concept status server request failed", testError);
  });
})
