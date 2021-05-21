import { shallowMount } from "@vue/test-utils";
import ConceptTypes from "@/components/dashboard/ConceptTypes.vue";
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
    ReportService.getConceptTypeReport = jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
            "iri": "http://www.w3.org/2002/07/owl#Class",
            "label": "Class",
            "count": 1030270
        },
        {
            "iri": "http://endhealth.info/im#LegacyConcept",
            "label": "Legacy Concept",
            "count": 93282
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#ObjectProperty",
            "label": "Object Property",
            "count": 1813
        },
        {
            "iri": "http://endhealth.info/im#Set",
            "label": "Set",
            "count": 1122
        },
        {
            "iri": "http://endhealth.info/im#RecordType",
            "label": "Record Type",
            "count": 94
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#DataProperty",
            "label": "Data Property",
            "count": 68
        },
        {
            "iri": "http://endhealth.info/im#QuerySet",
            "label": "Query set",
            "count": 45
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#FunctionalProperty",
            "label": "Functional Property",
            "count": 26
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#AnnotationProperty",
            "label": "Annotation Property",
            "count": 23
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#TransitiveProperty",
            "label": "Transitive Property",
            "count": 11
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#SymmetricProperty",
            "label": "Symmetric Property",
            "count": 11
        },
        {
            "iri": "http://endhealth.info/im#ValueSet",
            "label": "Value Set",
            "count": 8
        },
        {
            "iri": "http://endhealth.info/im#Folder",
            "label": "Folder",
            "count": 8
        },
        {
            "iri": "http://www.w3.org/2002/07/owl#ReflexiveProperty",
            "label": "Reflexive Property",
            "count": 2
        },
        {
            "iri": "http://endhealth.info/im#QueryTemplate",
            "label": "Query Template",
            "count": 1
        },
        {
            "iri": "http://www.w3.org/ns/shacl#NodeShape",
            "label": "Node Shape",
            "count": 1
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
    wrapper = shallowMount(ConceptTypes, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("sets the store loading over mount", async() => {
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", { key: "reportType", value: true });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportType", value: false })
  });

  it("calls the report service on mount", () => {
    expect(ReportService.getConceptTypeReport).toBeCalledTimes(1);
  });

  it("processes api return into realData, updatedChartOptions and chartConceptTypes", async() => {
    const testChartConceptType = {
      "datasets":[{
        "data":[
          680296.4437499999,
          67607.09999999999,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625,
          6338.165625
        ],
        "backgroundColor":[
          "#781c81",
          "#4d1f82",
          "#403e95",
          "#4063b0",
          "#4684c2",
          "#519cb8",
          "#62ac9a",
          "#77b77b",
          "#90bc62",
          "#abbe51",
          "#c3ba45",
          "#d7af3d",
          "#e39a36",
          "#e77830",
          "#e34d28",
          "#d92120"
        ],
        "hoverBackgroundColor":[
          "#bc8ec0",
          "#a68fc1",
          "#a09fca",
          "#a0b1d8",
          "#a3c2e1",
          "#a8cedc",
          "#b1d6cd",
          "#bbdbbd",
          "#c8deb1",
          "#d5dfa8",
          "#e1dda2",
          "#ebd79e",
          "#f1cd9b",
          "#f3bc98",
          "#f1a694",
          "#ec9090"
        ],
        "borderRadius":1,
      }],
      "labels":[
        "Class",
        "Legacy concept",
        "Object property",
        "Set",
        "Record type",
        "Data property",
        "Query set",
        "Functional property",
        "Annotation property",
        "Transitive property",
        "Symmetric property",
        "Value set",
        "Folder",
        "Reflexive property",
        "Query template",
        "Node shape"
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
    expect(wrapper.vm.chartConceptTypes).toEqual(testChartConceptType);
    expect(wrapper.vm.realData).toStrictEqual({"0":1030270,"1":93282,"2":1813,"3":1122,"4":94,"5":68,"6":45,"7":26,"8":23,"9":11,"10":11,"11":8,"12":8,"13":2,"14":1,"15":1});
    expect(wrapper.vm.updatedChartOptions.toString()).toEqual(testChartOptions.toString()
    );
  });

  it("can setChartColours", async() => {
    const testData = [
      {
          "iri": "http://www.w3.org/2002/07/owl#Class",
          "label": "Class",
          "count": 1030270
      },
      {
          "iri": "http://endhealth.info/im#LegacyConcept",
          "label": "Legacy Concept",
          "count": 93282
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#ObjectProperty",
          "label": "Object Property",
          "count": 1813
      },
      {
          "iri": "http://endhealth.info/im#Set",
          "label": "Set",
          "count": 1122
      },
      {
          "iri": "http://endhealth.info/im#RecordType",
          "label": "Record Type",
          "count": 94
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#DataProperty",
          "label": "Data Property",
          "count": 68
      },
      {
          "iri": "http://endhealth.info/im#QuerySet",
          "label": "Query set",
          "count": 45
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#FunctionalProperty",
          "label": "Functional Property",
          "count": 26
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#AnnotationProperty",
          "label": "Annotation Property",
          "count": 23
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#TransitiveProperty",
          "label": "Transitive Property",
          "count": 11
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#SymmetricProperty",
          "label": "Symmetric Property",
          "count": 11
      },
      {
          "iri": "http://endhealth.info/im#ValueSet",
          "label": "Value Set",
          "count": 8
      },
      {
          "iri": "http://endhealth.info/im#Folder",
          "label": "Folder",
          "count": 8
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#ReflexiveProperty",
          "label": "Reflexive Property",
          "count": 2
      },
      {
          "iri": "http://endhealth.info/im#QueryTemplate",
          "label": "Query Template",
          "count": 1
      },
      {
          "iri": "http://www.w3.org/ns/shacl#NodeShape",
          "label": "Node Shape",
          "count": 1
      }
    ];
    wrapper.vm.chartConceptTypes = new PieChartData(
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
          "iri": "http://www.w3.org/2002/07/owl#Class",
          "label": "Class",
          "count": 1030270
      },
      {
          "iri": "http://endhealth.info/im#LegacyConcept",
          "label": "Legacy Concept",
          "count": 93282
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#ObjectProperty",
          "label": "Object Property",
          "count": 1813
      },
      {
          "iri": "http://endhealth.info/im#Set",
          "label": "Set",
          "count": 1122
      },
      {
          "iri": "http://endhealth.info/im#RecordType",
          "label": "Record Type",
          "count": 94
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#DataProperty",
          "label": "Data Property",
          "count": 68
      },
      {
          "iri": "http://endhealth.info/im#QuerySet",
          "label": "Query set",
          "count": 45
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#FunctionalProperty",
          "label": "Functional Property",
          "count": 26
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#AnnotationProperty",
          "label": "Annotation Property",
          "count": 23
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#TransitiveProperty",
          "label": "Transitive Property",
          "count": 11
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#SymmetricProperty",
          "label": "Symmetric Property",
          "count": 11
      },
      {
          "iri": "http://endhealth.info/im#ValueSet",
          "label": "Value Set",
          "count": 8
      },
      {
          "iri": "http://endhealth.info/im#Folder",
          "label": "Folder",
          "count": 8
      },
      {
          "iri": "http://www.w3.org/2002/07/owl#ReflexiveProperty",
          "label": "Reflexive Property",
          "count": 2
      },
      {
          "iri": "http://endhealth.info/im#QueryTemplate",
          "label": "Query Template",
          "count": 1
      },
      {
          "iri": "http://www.w3.org/ns/shacl#NodeShape",
          "label": "Node Shape",
          "count": 1
      }
    ];
    wrapper.vm.setChartColours(mockRes);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartConceptTypes).toEqual({
      datasets:[{
        "data":[],
        "backgroundColor":["#781c81","#4d1f82","#403e95","#4063b0","#4684c2","#519cb8","#62ac9a","#77b77b","#90bc62","#abbe51","#c3ba45","#d7af3d","#e39a36","#e77830","#e34d28","#d92120"],
        "hoverBackgroundColor":["#bc8ec0","#a68fc1","#a09fca","#a0b1d8","#a3c2e1","#a8cedc","#b1d6cd","#bbdbbd","#c8deb1","#d5dfa8","#e1dda2","#ebd79e","#f1cd9b","#f3bc98","#f1a694","#ec9090"],"borderRadius":1
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
    ReportService.getConceptTypeReport = jest.fn().mockRejectedValue({ status: 400, error: testError });
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
    wrapper = shallowMount(ConceptTypes, {
      props: { chartOptions: testChartOptions, graphHeight: 200 },
      global: {
        components: { Card, Chart, ProgressSpinner },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    })
  });

  it("fires a toast message on service error and stops loading", () => {
    expect(ReportService.getConceptTypeReport).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", { key: "reportType", value: false });
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept type server request failed", testError));
    expect(LoggerService.error).toHaveBeenCalledTimes(2);
    expect(LoggerService.error).toHaveBeenLastCalledWith("Concept type server request failed", testError);
  });
})
