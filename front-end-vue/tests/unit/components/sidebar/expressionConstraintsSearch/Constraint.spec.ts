import Constraint from "@/components/sidebar/expressionConstraintsSearch/Constraint.vue";
import { shallowMount } from "@vue/test-utils";
import Dropdown from "primevue/dropdown";

describe("Constraint.vue ___prop value", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(Constraint, {
      global: { components: { Dropdown } },
      props: { id: "focusConcept_0constraint", position: 0, value: { name: "Descendant or self of", symbol: "<<" } }
    });
  });

  it("sets selected on mount", () => {
    expect(wrapper.vm.selected).toStrictEqual({ name: "Descendant or self of", symbol: "<<" });
  });

  it("confirms on selected change", () => {
    wrapper.vm.onConfirm = jest.fn();
    wrapper.vm.$options.watch.selected.call(wrapper.vm, { name: "Self", symbol: "<" });
    expect(wrapper.vm.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("emits onConfirm", () => {
    const warn = console.warn;
    console.warn = jest.fn();
    wrapper.vm.onConfirm();
    expect(wrapper.emitted().updateClicked[0]).toStrictEqual([
      {
        component: "Constraint",
        id: "focusConcept_0constraint",
        label: "<<",
        position: 0,
        type: "constraint",
        value: { name: "Descendant or self of", symbol: "<<" }
      }
    ]);
    console.warn = warn;
  });
});

describe("Constraint.vue ___ null prop value", () => {
  let wrapper: any;

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(Constraint, {
      global: { components: { Dropdown } },
      props: { id: "focusConcept_0constraint", position: 0, value: null }
    });
  });

  it("sets selected on mount", () => {
    expect(wrapper.vm.selected).toStrictEqual({ name: "Descendant or self of", symbol: "<<" });
  });
});
