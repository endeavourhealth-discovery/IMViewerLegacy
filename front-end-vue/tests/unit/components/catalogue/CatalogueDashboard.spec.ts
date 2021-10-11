import {shallowMount} from "@vue/test-utils";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Chart from "primevue/chart";
import CatalogueDashboard from "@/components/catalogue/CatalogueDashboard.vue";
import {PropType} from "@vue/runtime-core";
import Column from "primevue/column";

describe("CatalogueDashboard.vue", () => {
  let wrapper: any;

  beforeEach( () => {
    wrapper = shallowMount(CatalogueDashboard, {
      global: {
        components: {Card, DataTable, Chart, Column },
      },
      props: {
        types: [
          {
            count:267904,
            iri:"http://endhealth.info/im#Organisation",
            label:"Organisation  (record type)"
          },
          {
            count:267904,
            iri:"http://endhealth.info/im#Address",
            label:"Address (record type)"
          }
        ]
      }
    });
  });

  it("set chart data", () => {
    const testChartOptions = {
      legend: {
        position: "right",
        onHover: function(e: any) {}
      },
      hover: {
        onHover: function(e: any) {}
      },
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {}
        }
      }
    };
    expect(wrapper.vm.chartInstanceTypes).toEqual({
      datasets: [{
        backgroundColor:["#781c81BB","#d92120BB"],
        borderRadius:1, data: [200928, 200928],
        hoverBackgroundColor: ["#781c81", "#d92120"] }],
      labels: ["http://endhealth.info/im#Organisation", "http://endhealth.info/im#Address"]
    });
    expect(wrapper.vm.realData).toStrictEqual({ "0": 267904, "1": 267904 });
    expect(wrapper.vm.chartOptions.toString()).toEqual(testChartOptions.toString());
  });

  it("setsLegendOptions ___ width > 1750", () => {
    global.innerWidth = 1760;
    const testOptions = {
      legend: {
        position: "right",
        labels: {
          boxWidth: 40,
          fontSize: 12
        },
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
    wrapper.vm.setLegendOptions();
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width > 1300", () => {
    global.innerWidth = 1310;
    const testOptions = {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          fontSize: 10
        },
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
    wrapper.vm.setLegendOptions();
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 1024", () => {
    global.innerWidth = 1024;
    const testOptions = {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          fontSize: 8
        },
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
    wrapper.vm.setLegendOptions();
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 892", () => {
    global.innerWidth = 892;
    const testOptions = {
      legend: {
        position: "right",
        labels: {
          boxWidth: 40,
          fontSize: 8
        },
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
    wrapper.vm.setLegendOptions(892);
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 557", () => {
    global.innerWidth = 557;
    const testOptions = {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          fontSize: 6
        },
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
    wrapper.vm.setLegendOptions();
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 0", () => {
    global.innerWidth = 0;
    const testOptions = {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          fontSize: 4
        },
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
    wrapper.vm.setLegendOptions();
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width other", () => {
    global.innerWidth = -1;
    const testOptions = {
      legend: {
        display: false
      }
    };
    wrapper.vm.setLegendOptions(-1);
    wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });
});