import { flushPromises, shallowMount } from "@vue/test-utils";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";
import Column from "primevue/column";
import EntityService from "@/services/EntityService";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

describe("ReportTable.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;
  let reportData = {
    "@id": "http://endhealth.info/im#ontologyOverview",
    "http://endhealth.info/im#hasStatsReportEntry": [
      {
        "http://www.w3.org/2002/07/owl#hasValue": 8,
        "http://www.w3.org/2000/01/rdf-schema#label": "Value sets"
      },
      {
        "http://www.w3.org/2002/07/owl#hasValue": 1973,
        "http://www.w3.org/2000/01/rdf-schema#label": "Data models"
      },
      {
        "http://www.w3.org/2002/07/owl#hasValue": 1124984,
        "http://www.w3.org/2000/01/rdf-schema#label": "Ontology"
      }
    ],
    "http://www.w3.org/2000/01/rdf-schema#comment": "A brief overview of the concepts stored in the Ontology",
    "http://www.w3.org/2000/01/rdf-schema#label": "Ontology overview"
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue(reportData);
    mockStore = {
      commit: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    wrapper = shallowMount(ReportTable, {
      props: { iri: "im:Test" },
      global: {
        components: { Card, DataTable, ProgressSpinner, Column },
        mocks: { $store: mockStore, $toast: mockToast }
      }
    });

    await flushPromises();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.tableData).toStrictEqual([
      { count: 8, label: "Value sets" },
      { count: 1973, label: "Data models" },
      { count: 1124984, label: "Ontology" }
    ]);
  });

  it("can getReportTableData ___ correct object", async () => {
    wrapper.vm.tableData = [] as { count: number; label: string }[];
    wrapper.vm.getReportTableData();
    expect(mockStore.commit).toHaveBeenCalledWith("updateLoading", {
      key: "reportTable_" + "im:Test",
      value: true
    });
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("im:Test", [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY]);
    await flushPromises();
    expect(wrapper.vm.tableData).toStrictEqual([
      { count: 8, label: "Value sets" },
      { count: 1973, label: "Data models" },
      { count: 1124984, label: "Ontology" }
    ]);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "reportTable_" + "im:Test",
      value: false
    });
  });

  it("can getReportTableData ___ object missing key", async () => {
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({
      "@id": "http://endhealth.info/im#ontologyOverview",
      "http://www.w3.org/2000/01/rdf-schema#comment": "A brief overview of the concepts stored in the Ontology",
      "http://www.w3.org/2000/01/rdf-schema#label": "Ontology overview"
    });
    wrapper.vm.tableData = [] as { count: number; label: string }[];
    wrapper.vm.getReportTableData();
    expect(mockStore.commit).toHaveBeenCalledWith("updateLoading", {
      key: "reportTable_" + "im:Test",
      value: true
    });
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("im:Test", [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY]);
    await flushPromises();
    expect(wrapper.vm.tableData).toStrictEqual([]);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "reportTable_" + "im:Test",
      value: false
    });
  });
});
