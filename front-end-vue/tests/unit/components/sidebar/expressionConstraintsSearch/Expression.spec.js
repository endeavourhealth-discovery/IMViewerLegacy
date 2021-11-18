import Expression from "@/components/sidebar/expressionConstraintsSearch/Expression.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";
import InputText from "primevue/inputtext";
import OverlayPanel from "primevue/overlaypanel";
import EntityService from "@/services/EntityService";

describe("Expression.vue ___ value", () => {
  let wrapper;
  let mockRef;

  const EXPRESSION = {
    code: "",
    name: "ANY",
    iri: "",
    isDescendentOf: [],
    weighting: 0,
    scheme: {},
    status: {},
    match: "ANY",
    entityType: [{ "@id": "http://endhealth.info/im#Concept", name: "Concept" }]
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    EntityService.advancedSearch = jest.fn().mockResolvedValue([
      {
        name: "Scoliosis deformity of spine",
        iri: "http://snomed.info/sct#298382003",
        code: "298382003",
        description: "Scoliosis deformity of spine (disorder)",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        entityType: [
          { name: "Address (record type)", "@id": "http://endhealth.info/im#Address" },
          { name: "Concept", "@id": "http://endhealth.info/im#Concept" }
        ],
        isDescendentOf: [],
        weighting: 2,
        match: "Scoliosis"
      },
      {
        name: "Acquired scoliosis",
        iri: "http://snomed.info/sct#111266001",
        code: "111266001",
        description: "Acquired scoliosis (disorder)",
        status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        entityType: [
          { name: "Concept", "@id": "http://endhealth.info/im#Concept" },
          { name: "Organisation  (record type)", "@id": "http://endhealth.info/im#Organisation" }
        ],
        isDescendentOf: [],
        weighting: 11,
        match: "Acquired scoliosis"
      }
    ]);

    mockRef = { render: () => {}, methods: { hide: jest.fn(), show: jest.fn() } };

    wrapper = shallowMount(Expression, {
      props: { id: "focusConcept_0expression", position: 1, value: EXPRESSION },
      global: { components: { InputText, OverlayPanel }, stubs: { OverlayPanel: mockRef } }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
  });

  it("mounts", () => {
    expect(wrapper.vm.id).toBe("focusConcept_0expression");
    expect(wrapper.vm.position).toBe(1);
    expect(wrapper.vm.value).toStrictEqual(EXPRESSION);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.debounce).toBe(0);
    expect(wrapper.vm.selectedResult).toStrictEqual({
      code: "",
      entityType: [
        {
          "@id": "http://endhealth.info/im#Concept",
          name: "Concept"
        }
      ],
      iri: "",
      isDescendentOf: [],
      match: "ANY",
      name: "ANY",
      scheme: {},
      status: {},
      weighting: 0
    });
    expect(wrapper.vm.request).toStrictEqual({});
    expect(wrapper.vm.anyModel).toStrictEqual(EXPRESSION);
    expect(wrapper.vm.searchTerm).toBe("ANY");
    expect(wrapper.vm.searchResults).toStrictEqual([]);
  });
});
