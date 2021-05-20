import { shallowMount } from "@vue/test-utils";
import ConceptSchemes from "@/components/dashboard/ConceptSchemes.vue";
import Card from "primevue/card";
import Chart from "primevue/chart";
import ProgressSpinner from "primevue/progressspinner";
import ReportService from "@/services/ReportService";

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
  })
});
