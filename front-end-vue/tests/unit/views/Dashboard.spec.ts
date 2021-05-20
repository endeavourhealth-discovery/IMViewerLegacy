import { flushPromises, shallowMount } from "@vue/test-utils";
import Dashboard from "@/views/Dashboard.vue";
import OntologyOverview from "@/components/dashboard/OntologyOverview.vue";
import ConceptTypes from "@/components/dashboard/ConceptTypes.vue";
import ConceptSchemes from "@/components/dashboard/ConceptSchemes.vue";
import ConceptStatus from "@/components/dashboard/ConceptStatus.vue";

describe("Dashboard.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Dashboard, {
      global: {
        components: { OntologyOverview, ConceptSchemes, ConceptStatus, ConceptTypes }
      }
    });
  });

  it("updates onResize", async() => {
    wrapper.vm.onResize();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.windowHeight).toBeGreaterThan(0);
    expect(wrapper.vm.windowWidth).toBeGreaterThan(0);
  });

  it("setsLegendOptions ___ width > 1750", async() => {
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
    wrapper.vm.setLegendOptions(1751);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width > 1300", async() => {
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
    wrapper.vm.setLegendOptions(1301);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 1024", async() => {
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
    wrapper.vm.setLegendOptions(1024);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 892", async() => {
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
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 557", async() => {
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
    wrapper.vm.setLegendOptions(557);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width >= 0", async() => {
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
    wrapper.vm.setLegendOptions(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });

  it("setsLegendOptions ___ width other", async() => {
    const testOptions = {
      legend: {
        display: false
      }
    };
    wrapper.vm.setLegendOptions(-1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chartOptions.toString()).toEqual(testOptions.toString());
  });
});
