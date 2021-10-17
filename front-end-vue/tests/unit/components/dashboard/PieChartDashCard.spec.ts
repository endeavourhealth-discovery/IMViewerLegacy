import { shallowMount } from "@vue/test-utils";
import PieChartDashCard from "@/components/dashboard/PieChartDashCard.vue";
import Card from "primevue/card";

describe("PieChartDashCard.vue", () => {
  let wrapper: any;
  let docSpyId: any;
  let docSpyClass: any;
  let windowSpy: any;
  let inputData = [
    { "http://www.w3.org/2002/07/owl#hasValue": 1030354, "http://www.w3.org/2000/01/rdf-schema#label": "Class" },
    { "http://www.w3.org/2002/07/owl#hasValue": 93282, "http://www.w3.org/2000/01/rdf-schema#label": "Legacy concept" },
    { "http://www.w3.org/2002/07/owl#hasValue": 1811, "http://www.w3.org/2000/01/rdf-schema#label": "Object property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 1122, "http://www.w3.org/2000/01/rdf-schema#label": "Set" },
    { "http://www.w3.org/2002/07/owl#hasValue": 99, "http://www.w3.org/2000/01/rdf-schema#label": "Node shape" },
    { "http://www.w3.org/2002/07/owl#hasValue": 94, "http://www.w3.org/2000/01/rdf-schema#label": "Record type" },
    { "http://www.w3.org/2002/07/owl#hasValue": 68, "http://www.w3.org/2000/01/rdf-schema#label": "Data property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 45, "http://www.w3.org/2000/01/rdf-schema#label": "Query set" },
    { "http://www.w3.org/2002/07/owl#hasValue": 26, "http://www.w3.org/2000/01/rdf-schema#label": "Functional property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 23, "http://www.w3.org/2000/01/rdf-schema#label": "Annotation property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 11, "http://www.w3.org/2000/01/rdf-schema#label": "Symmetric property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 11, "http://www.w3.org/2000/01/rdf-schema#label": "Transitive property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 8, "http://www.w3.org/2000/01/rdf-schema#label": "Folder" },
    { "http://www.w3.org/2002/07/owl#hasValue": 8, "http://www.w3.org/2000/01/rdf-schema#label": "Value set" },
    { "http://www.w3.org/2002/07/owl#hasValue": 2, "http://www.w3.org/2000/01/rdf-schema#label": "Reflexive property" },
    { "http://www.w3.org/2002/07/owl#hasValue": 1, "http://www.w3.org/2000/01/rdf-schema#label": "Query template" }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    docSpyId = jest.spyOn(document, "getElementById");
    docSpyId.mockReturnValue(undefined);

    docSpyClass = jest.spyOn(document, "getElementsByClassName");
    docSpyClass.mockReturnValue([undefined]);

    windowSpy = jest.spyOn(window, "getComputedStyle");
    windowSpy.mockReturnValue({ getPropertyValue: jest.fn().mockReturnValue("16px") });

    const err = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(PieChartDashCard, {
      props: {
        name: "Ontology concept types",
        inputData: inputData,
        description: "A brief overview of the types of data stored in the Ontology",
        id: "Chart1",
        labelKey: "http://www.w3.org/2000/01/rdf-schema#label",
        dataKey: "http://www.w3.org/2002/07/owl#hasValue"
      },
      global: {
        components: { Card }
      }
    });

    console.error = err;

    await wrapper.vm.$nextTick();
  });

  it("can remove eventListener", () => {
    console.error = jest.fn();
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });
});
