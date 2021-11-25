import RefinementGroup from "@/components/sidebar/expressionConstraintsSearch/RefinementGroup.vue";
import InputSwitch from "primevue/inputswitch";
import { shallowMount } from "@vue/test-utils";

describe("RefinementGroup.vue ___ no value", () => {
  let wrapper;

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
});
