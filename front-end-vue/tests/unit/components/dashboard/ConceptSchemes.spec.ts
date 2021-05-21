import { shallowMount } from "@vue/test-utils";
import ConceptSchemes from "@/components/dashboard/ConceptSchemes.vue";
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
    ReportService.getConceptSchemeReport = jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
          iri: "http://endhealth.info/im#SnomedCodeScheme",
          label: "Snomed-CT code",
          count: 1029846
        },
        {
          iri: "http://endhealth.info/im#EMISCodeScheme",
          label: "EMIS code scheme",
          count: 64098
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
    wrapper = shallowMount(ConceptSchemes, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("sets the store loading over mount", async() => {
    expect(mockStore.commit).toBeCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", { key: "reportScheme", value: true });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportScheme", value: false })
  });

  it("calls the report service on mount", () => {
    expect(ReportService.getConceptSchemeReport).toBeCalledTimes(1);
  });

  it("processes api return into realData, updatedChartOptions and chartConceptSchemes", async() => {
    const testChartConceptSchemes = {
      datasets: [
        {
          backgroundColor: [
            "#781c81",
            "#d92120"
          ],
          borderRadius: 1,
          data: [
            771230.52,
            49227.479999999996
          ],
          hoverBackgroundColor: [
            "#bc8ec0",
            "#ec9090"
          ]
        }
      ],
      labels: [
        "Snomed-CT code",
        "EMIS code scheme"
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
    expect(wrapper.vm.chartConceptSchemes).toEqual(testChartConceptSchemes);
    expect(wrapper.vm.realData).toStrictEqual({ 0: 1029846, 1: 64098 });
    expect(wrapper.vm.updatedChartOptions.toString()).toEqual(testChartOptions.toString()
    );
  });

  it("can setChartColours", async() => {
    const testData = [
      {
          "iri": "http://endhealth.info/im#SnomedCodeScheme",
          "label": "Snomed-CT code",
          "count": 1029846
      },
      {
          "iri": "http://endhealth.info/im#EMISCodeScheme",
          "label": "EMIS code scheme",
          "count": 64098
      },
      {
          "iri": "http://endhealth.info/im#ICD10CodeScheme",
          "label": "ICD10 code",
          "count": 17934
      },
      {
          "iri": "http://endhealth.info/im#OPSC49CodeScheme",
          "label": "OPCS4-9 code scheme",
          "count": 11275
      },
      {
          "iri": "http://endhealth.info/im#VisionCodeScheme",
          "label": "Vision Read2 code scheme",
          "count": 2238
      },
      {
          "iri": "http://endhealth.info/im#DiscoveryCodeScheme",
          "label": "Discovery code scheme",
          "count": 1960
      },
      {
          "iri": "http://endhealth.info/im#ODS_code",
          "label": "ODS code",
          "count": 145
      }
    ];
    wrapper.vm.chartConceptSchemes = new PieChartData(
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
          "iri": "http://endhealth.info/im#SnomedCodeScheme",
          "label": "Snomed-CT code",
          "count": 1029846
      },
      {
          "iri": "http://endhealth.info/im#EMISCodeScheme",
          "label": "EMIS code scheme",
          "count": 64098
      },
      {
          "iri": "http://endhealth.info/im#ICD10CodeScheme",
          "label": "ICD10 code",
          "count": 17934
      },
      {
          "iri": "http://endhealth.info/im#OPSC49CodeScheme",
          "label": "OPCS4-9 code scheme",
          "count": 11275
      },
      {
          "iri": "http://endhealth.info/im#VisionCodeScheme",
          "label": "Vision Read2 code scheme",
          "count": 2238
      },
      {
          "iri": "http://endhealth.info/im#DiscoveryCodeScheme",
          "label": "Discovery code scheme",
          "count": 1960
      },
      {
          "iri": "http://endhealth.info/im#ODS_code",
          "label": "ODS code",
          "count": 145
      }
    ];
    wrapper.vm.setChartColours(mockRes);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartConceptSchemes).toEqual({
      datasets:[{
        "data":[],
        "backgroundColor":["#781c81","#3f51a3","#519cb8","#83ba6d","#c3ba45","#e68a33","#d92120"],
        "hoverBackgroundColor":["#bc8ec0","#9fa8d1","#a8cedc","#c1ddb6","#e1dda2","#f3c599","#ec9090"],"borderRadius":1
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
    testError = new Error("concept schemes deliberate test error")
    ReportService.getConceptSchemeReport = jest.fn().mockRejectedValue({ status: 400, error: testError });
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
    wrapper = shallowMount(ConceptSchemes, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("fires a toast message on service error and stops loading", () => {
    expect(ReportService.getConceptSchemeReport).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportScheme", value: false });
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept schemes server request failed", testError));
    expect(LoggerService.error).toHaveBeenCalledTimes(2);
    expect(LoggerService.error).toHaveBeenLastCalledWith("Concept schemes server request failed", testError);
  });
})
