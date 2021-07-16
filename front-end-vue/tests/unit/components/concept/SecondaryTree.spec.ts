import { flushPromises, shallowMount } from "@vue/test-utils";
import SecondaryTree from "@/components/concept/SecondaryTree.vue";
import Button from "primevue/button";
import Tree from "primevue/tree";
import ProgressSpinner from "primevue/progressspinner";
import OverlayPanel from "primevue/overlaypanel";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("SecondaryTree.vue", () => {
  let wrapper: any;
  let mockToast: any;

  beforeEach(async() => {
    jest.resetAllMocks();
    mockToast = {
      add: jest.fn()
    };

    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ data: {"@id":"http://snomed.info/sct#298382003","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"}});
    EntityService.getEntityParents = jest.fn().mockResolvedValue({ data: [{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}]});
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}]});

    wrapper = shallowMount(SecondaryTree, {
      global: {
        components: { Button, Tree, ProgressSpinner, OverlayPanel },
        mocks: { $toast: mockToast },
      },
      props: { conceptIri: "http://snomed.info/sct#298382003" }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    await flushPromises();
    jest.clearAllMocks();
  });

  it("mounts", () => {
    expect(wrapper.vm.conceptAggregate).toStrictEqual({"concept":{"@id":"http://snomed.info/sct#298382003","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"},"parents":[{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}],"children":[{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}]});
    expect(wrapper.vm.root).toStrictEqual([{"children": [{"children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#111266001", "key": "Acquired scoliosis (disorder)", "label": "Acquired scoliosis (disorder)", "leaf": false, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}, { "children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#773773006", "key": "Acrodysplasia scoliosis (disorder)", "label": "Acrodysplasia scoliosis (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}, { "children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#205045003", "key": "Congenital scoliosis due to bony malformation (disorder)", "label": "Congenital scoliosis due to bony malformation (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}], "color": "#e39a3688", "data": "http://snomed.info/sct#298382003", "key": "Scoliosis deformity of spine (disorder)", "label": "Scoliosis deformity of spine (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}]);
    expect(wrapper.vm.expandedKeys).toStrictEqual({"Scoliosis deformity of spine (disorder)": true});
    expect(wrapper.vm.selectedKey).toStrictEqual({"Scoliosis deformity of spine (disorder)": true});
    expect(wrapper.vm.currentParent).toStrictEqual({"iri": "http://snomed.info/sct#64217002", "listPosition": 0, "name": "Curvature of spine (disorder)"});
    expect(wrapper.vm.alternateParents).toStrictEqual([{"iri": "http://snomed.info/sct#928000", "listPosition": 1, "name": "Disorder of musculoskeletal system (disorder)"}, {"iri": "http://snomed.info/sct#699699005", "listPosition": 2, "name": "Disorder of vertebral column (disorder)"}]);
    expect(wrapper.vm.parentPosition).toBe(0);
    expect(wrapper.vm.hoveredResult).toStrictEqual({});
  });

  it("updates on conceptIri watch change", async() => {
    wrapper.vm.getConceptAggregate = jest.fn();
    wrapper.vm.createTree = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#298382003");
    expect(wrapper.vm.selectedKey).toStrictEqual({});
    expect(wrapper.vm.alternateParents).toStrictEqual([]);
    expect(wrapper.vm.expandedKeys).toStrictEqual({});
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConceptAggregate).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(wrapper.vm.createTree).toHaveBeenCalledTimes(1);
  });

  it("can getConceptAggregate ___ success", async() => {
    wrapper.vm.conceptAggregate = {};
    expect(wrapper.vm.conceptAggregate).toStrictEqual({});
    wrapper.vm.getConceptAggregate("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", ["http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#label"]);
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.conceptAggregate).toStrictEqual({"concept":{"@id":"http://snomed.info/sct#298382003","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"},"parents":[{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}],"children":[{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}]});
  });

  it("can getConceptAggregate ___ fail", async() => {
    wrapper.vm.conceptAggregate = {};
    expect(wrapper.vm.conceptAggregate).toStrictEqual({});
    EntityService.getPartialEntity = jest.fn().mockRejectedValue(false);
    EntityService.getEntityParents = jest.fn().mockRejectedValue(false);
    EntityService.getEntityChildren = jest.fn().mockRejectedValue(false);
    wrapper.vm.getConceptAggregate("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", ["http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#label"]);
    expect(EntityService.getEntityParents).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityParents).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Secondary tree selected concept aggregate server request failed"));
  });

  it("can createTree ___  !selected in expanded", async() => {
    wrapper.vm.setParents = jest.fn();
    wrapper.vm.root = [];
    wrapper.vm.expandedKeys = {};
    wrapper.vm.selectedKey = {};
    wrapper.vm.createTree(
      {"@id":"http://snomed.info/sct#298382003","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"},
      [{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#699699005"}],
      [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}], 0
    );
      expect(wrapper.vm.root).toStrictEqual([{"children": [{"children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#111266001", "key": "Acquired scoliosis (disorder)", "label": "Acquired scoliosis (disorder)", "leaf": false, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}, {"children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#773773006", "key": "Acrodysplasia scoliosis (disorder)", "label": "Acrodysplasia scoliosis (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}, {"children": [], "color": "#e39a3688", "data": "http://snomed.info/sct#205045003", "key": "Congenital scoliosis due to bony malformation (disorder)", "label": "Congenital scoliosis due to bony malformation (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}], "color": "#e39a3688", "data": "http://snomed.info/sct#298382003", "key": "Scoliosis deformity of spine (disorder)", "label": "Scoliosis deformity of spine (disorder)", "leaf": true, "loading": false, "typeIcon": "far fa-fw fa-lightbulb"}]);
      expect(wrapper.vm.setParents).toHaveBeenCalledTimes(1);
  });
});
