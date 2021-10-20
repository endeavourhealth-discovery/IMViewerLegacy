import { shallowMount } from "@vue/test-utils";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressSpinner from "primevue/progressspinner";

describe("ReportTable.vue", () => {
  let wrapper: any;
  let reportData = [
    { "http://www.w3.org/2002/07/owl#hasValue": 8, "http://www.w3.org/2000/01/rdf-schema#label": "Value sets" },
    { "http://www.w3.org/2002/07/owl#hasValue": 1973, "http://www.w3.org/2000/01/rdf-schema#label": "Data models" },
    { "http://www.w3.org/2002/07/owl#hasValue": 1124984, "http://www.w3.org/2000/01/rdf-schema#label": "Ontology" }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    wrapper = shallowMount(ReportTable, {
      props: { inputData: reportData, description: "A brief overview of the concepts stored in the Ontology", name: "Ontology overview", id: "reportTable1" },
      global: {
        components: { Card, DataTable, Column, ProgressSpinner }
      }
    });

    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.tableData).toStrictEqual([
      { count: 8, label: "Value sets" },
      { count: 1973, label: "Data models" },
      { count: 1124984, label: "Ontology" }
    ]);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("can getReportTableData ___ correct object", async () => {
    wrapper.vm.tableData = [] as { count: number; label: string }[];
    wrapper.vm.getReportTableData();
    expect(wrapper.vm.tableData).toStrictEqual([
      { count: 8, label: "Value sets" },
      { count: 1973, label: "Data models" },
      { count: 1124984, label: "Ontology" }
    ]);
  });
});
