import Refinement from "@/components/sidebar/expressionConstraintsSearch/Refinement.vue";
import { shallowMount } from "@vue/test-utils";

describe("Refinement.vue ___ value", () => {
  let wrapper: any;

  const REFINEMENT_BUILD = [
    {
      id: "refinementGroup_1refinementconstraint",
      value: { name: "Descendant or self of", symbol: "<<" },
      position: 0,
      type: "constraint",
      label: "<<",
      component: "Constraint"
    },
    {
      value: {
        code: "",
        name: "ANY",
        iri: "",
        isDescendentOf: [],
        weighting: 0,
        scheme: {},
        status: {},
        match: "ANY",
        entityType: [{ "@id": "http://endhealth.info/im#Concept", name: "Concept" }]
      },
      id: "refinementGroup_1refinementexpression",
      position: 1,
      type: "expression",
      label: "*",
      component: "Expression"
    },
    { id: "refinementGroup_1refinementoperator", value: { symbol: "=", name: "Equals" }, position: 2, type: "operator", component: "Operator", label: "=" },
    {
      id: "refinementGroup_1refinementconstraint",
      value: { name: "Descendant or self of", symbol: "<<" },
      position: 3,
      type: "constraint",
      label: "<<",
      component: "Constraint"
    },
    {
      value: {
        code: "",
        name: "ANY",
        iri: "",
        isDescendentOf: [],
        weighting: 0,
        scheme: {},
        status: {},
        match: "ANY",
        entityType: [{ "@id": "http://endhealth.info/im#Concept", name: "Concept" }]
      },
      id: "refinementGroup_1refinementexpression",
      position: 4,
      type: "expression",
      label: "*",
      component: "Expression"
    }
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    wrapper = shallowMount(Refinement, {
      props: {
        id: "refinementGroup_1refinement",
        last: true,
        position: 0,
        value: {
          children: REFINEMENT_BUILD
        }
      }
    });
  });

  it("mounts", () => {
    expect(wrapper.vm.refinementBuild).toStrictEqual(REFINEMENT_BUILD);
    expect(wrapper.vm.id).toBe("refinementGroup_1refinement");
    expect(wrapper.vm.last).toBe(true);
    expect(wrapper.vm.position).toBe(0);
    expect(wrapper.vm.value).toStrictEqual({ children: REFINEMENT_BUILD });
  });
});
