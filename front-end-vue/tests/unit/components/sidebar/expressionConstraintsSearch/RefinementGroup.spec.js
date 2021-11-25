import RefinementGroup from "@/components/sidebar/expressionConstraintsSearch/RefinementGroup.vue";
import InputSwitch from "primevue/inputswitch";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("RefinementGroup.vue ___ no value", () => {
  let wrapper;
  let docSpy;

  const REFINEMENT_BUILD = [
    {
      id: "refinementGroup_1refinement_0",
      value: null,
      position: 0,
      type: "refinement",
      label: "",
      component: "Refinement"
    },
    {
      id: "refinementGroup_1addNext_1",
      value: { previousPosition: 0, previousComponentType: "refinement", parentGroup: "refinementGroup" },
      position: 1,
      type: "addNext",
      label: "",
      component: "AddNext"
    }
  ];

  beforeEach(async () => {
    jest.resetAllMocks();

    wrapper = shallowMount(RefinementGroup, {
      global: { components: { InputSwitch } },
      props: { id: "refinementGroup_1", last: true, position: 1, value: undefined }
    });

    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.id).toBe("refinementGroup_1");
    expect(wrapper.vm.last).toBe(true);
    expect(wrapper.vm.value).toBe(undefined);
    expect(wrapper.vm.group).toBe(false);
    expect(wrapper.vm.refinementGroupBuild).toStrictEqual(REFINEMENT_BUILD);
  });

  it("can update on refinementBuild change", () => {
    const testData = {
      id: "refinementGroup_1",
      value: { children: REFINEMENT_BUILD, group: false },
      position: 1,
      type: "refinementGroup",
      label: "",
      component: "RefinementGroup"
    };
    wrapper.vm.createRefinementGroup = jest.fn().mockReturnValue(testData);
    wrapper.vm.$options.watch.refinementGroupBuild.handler.call(wrapper.vm, REFINEMENT_BUILD);
    expect(wrapper.emitted().updateClicked).toBeTruthy();
    expect(wrapper.emitted().updateClicked[1]).toStrictEqual([testData]);
  });

  it("can update on group change", () => {
    const testData = {
      id: "refinementGroup_1",
      value: { children: REFINEMENT_BUILD, group: false },
      position: 1,
      type: "refinementGroup",
      label: "",
      component: "RefinementGroup"
    };
    wrapper.vm.createRefinementGroup = jest.fn().mockReturnValue(testData);
    wrapper.vm.$options.watch.group.call(wrapper.vm, true);
    expect(wrapper.emitted().updateClicked).toBeTruthy();
    expect(wrapper.emitted().updateClicked[1]).toStrictEqual([testData]);
  });

  it("can emit onConfirm", () => {
    const testData = {
      id: "refinementGroup_1",
      value: { children: REFINEMENT_BUILD, group: false },
      position: 1,
      type: "refinementGroup",
      label: "",
      component: "RefinementGroup"
    };
    wrapper.vm.createRefinementGroup = jest.fn().mockReturnValue(testData);
    wrapper.vm.onConfirm();
    expect(wrapper.emitted().addClicked).toBeTruthy();
    expect(wrapper.emitted().addClicked[0]).toStrictEqual([testData]);
  });

  it("can emit on deleteClicked", () => {
    const testData = {
      id: "refinementGroup_1",
      value: { children: REFINEMENT_BUILD, group: false },
      position: 1,
      type: "refinementGroup",
      label: "",
      component: "RefinementGroup"
    };
    wrapper.vm.createRefinementGroup = jest.fn().mockReturnValue(testData);
    wrapper.vm.deleteClicked();
    expect(wrapper.emitted().deleteClicked).toBeTruthy();
    expect(wrapper.emitted().deleteClicked[0]).toStrictEqual([testData]);
  });

  it("can addNextOptions ___ not addNext", () => {
    wrapper.vm.refinementGroupBuild = [
      {
        id: "refinementGroup_1refinement_0",
        value: {
          children: []
        },
        position: 0,
        type: "refinement",
        label: "<< * = << *",
        component: "Refinement"
      },
      { id: "refinementGroup_1logic_1", value: "AND", position: 1, type: "logic", component: "Logic", label: "AND" },
      {
        id: "refinementGroup_1addNext_2",
        value: { previousPosition: 1, previousComponentType: "logic", parentGroup: "refinementGroup" },
        position: 2,
        type: "addNext",
        label: "",
        component: "AddNext"
      }
    ];
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);
    wrapper.vm.getNextOptions = jest.fn().mockReturnValue({
      id: "refinementGroup_1addNext_1",
      value: {
        previousPosition: 0,
        previousComponentType: "refinement",
        parentGroup: "refinementGroup"
      },
      position: 1,
      type: "addNext",
      label: "",
      component: "AddNext"
    });
    wrapper.vm.updatePositions = jest.fn();
    wrapper.vm.addNextOptions({ previousComponentType: "refinement", previousPosition: 0, parentGroup: "refinementGroup" });
    expect(wrapper.vm.refinementGroupBuild).toStrictEqual([
      {
        id: "refinementGroup_1refinement_0",
        value: {
          children: []
        },
        position: 0,
        type: "refinement",
        label: "<< * = << *",
        component: "Refinement"
      },
      {
        id: "refinementGroup_1addNext_1",
        value: { previousPosition: 0, previousComponentType: "refinement", parentGroup: "refinementGroup" },
        position: 1,
        type: "addNext",
        label: "",
        component: "AddNext"
      },
      { id: "refinementGroup_1logic_1", value: "AND", position: 1, type: "logic", component: "Logic", label: "AND" },
      {
        id: "refinementGroup_1addNext_2",
        value: { previousPosition: 1, previousComponentType: "logic", parentGroup: "refinementGroup" },
        position: 2,
        type: "addNext",
        label: "",
        component: "AddNext"
      }
    ]);
    expect(wrapper.vm.updatePositions).toHaveBeenCalledTimes(1);
  });

  it("can addNextOptions ___ addNext", async () => {
    wrapper.vm.refinementGroupBuild = [
      {
        id: "refinementGroup_1refinement_0",
        value: {
          children: []
        },
        position: 0,
        type: "refinement",
        label: "<< * = << *",
        component: "Refinement"
      },
      { id: "refinementGroup_1logic_1", value: "AND", position: 1, type: "logic", component: "Logic", label: "AND" },
      {
        id: "refinementGroup_1addNext_2",
        value: { previousPosition: 1, previousComponentType: "logic", parentGroup: "refinementGroup" },
        position: 2,
        type: "addNext",
        label: "",
        component: "AddNext"
      }
    ];
    const mockElement = document.createElement("div");
    mockElement.scrollIntoView = jest.fn();
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.getNextOptions = jest.fn().mockReturnValue({
      id: "refinementGroup_1addNext_1",
      value: {
        previousPosition: 1,
        previousComponentType: "logic",
        parentGroup: "refinementGroup"
      },
      position: 2,
      type: "addNext",
      label: "",
      component: "AddNext"
    });
    wrapper.vm.updatePositions = jest.fn();
    wrapper.vm.addNextOptions({ previousComponentType: "logic", previousPosition: 1, parentGroup: "refinementGroup" });
    expect(wrapper.vm.refinementGroupBuild).toStrictEqual([
      {
        id: "refinementGroup_1refinement_0",
        value: {
          children: []
        },
        position: 0,
        type: "refinement",
        label: "<< * = << *",
        component: "Refinement"
      },
      { id: "refinementGroup_1logic_1", value: "AND", position: 1, type: "logic", component: "Logic", label: "AND" },
      {
        id: "refinementGroup_1addNext_1",
        value: { previousPosition: 1, previousComponentType: "logic", parentGroup: "refinementGroup" },
        position: 2,
        type: "addNext",
        label: "",
        component: "AddNext"
      }
    ]);
    expect(wrapper.vm.updatePositions).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("can emit on addNextClicked", async () => {
    wrapper.vm.addNextClicked();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().addNextOptionsClicked).toBeTruthy();
    expect(wrapper.emitted().addNextOptionsClicked[0]).toStrictEqual([{ previousComponentType: "refinementGroup", previousPosition: 1 }]);
  });
});
