import { flushPromises, shallowMount } from "@vue/test-utils";
import Concept from "@/views/Concept.vue";
import Tooltip from "primevue/tooltip";
import ContextMenu from "primevue/contextmenu";
import VueClipboard from "vue3-clipboard";
import Button from "primevue/button";
import LoggerService from "@/services/LoggerService";
import PanelHeader from "@/components/concept/PanelHeader.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Definition from "@/components/concept/Definition.vue";
import Terms from "@/components/concept/Terms.vue";
import ComplexMappings from "@/components/concept/ComplexMappings.vue";
import UsedIn from "@/components/concept/UsedIn.vue";
import Graph from "@/components/concept/Graph.vue";
import Members from "@/components/concept/Members.vue";
import SecondaryTree from "@/components/concept/SecondaryTree.vue";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Panel from "primevue/panel";
import EntityService from "@/services/EntityService";

describe("Concept.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();

    const mockElement = document.createElement("div");
    mockElement.style.height = "100px";
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return { height: 100, width: 0, top: 0, bottom: 0, right: 0, x: 0, y: 0, left: 0, toJSON: jest.fn() }
    });
    Element.prototype.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    let docSpy: any;
    mockElement.style.height = 100 + "px";
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(mockElement);

    let windowSpy: any;
    windowSpy = jest.spyOn(window, "getComputedStyle");
    windowSpy.mockReturnValue({ getPropertyValue: jest.fn().mockReturnValue(16) })

    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data:[{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}]});
    EntityService.getEntityDefinitionDto = jest.fn().mockResolvedValue({data:{"iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]}});
    mockStore = {
      state: {
        conceptIri: "http://snomed.info/sct#298382003"
      },
      commit: jest.fn(),
      dispatch: jest.fn()
    };
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };

    wrapper = shallowMount(Concept, {
      global: {
        components: {
          Definition,
          ComplexMappings,
          ContextMenu,
          Button,
          TabPanel,
          TabView,
          Terms,
          SecondaryTree,
          UsedIn,
          Members,
          Graph,
          PanelHeader,
          Panel,
          DownloadDialog
        },
        mocks: { $store: mockStore, $router: mockRouter, $toast: mockToast },
        directives: { "tooltip": Tooltip, "clipboard": VueClipboard }
      }
    });
  });

  it("starts with data from mounted", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editDialogView).toBeTruthy();
    expect(wrapper.vm.showDownloadDialog).toBeFalsy();
    expect(wrapper.vm.concept).toStrictEqual({"iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]});
    expect(wrapper.vm.semanticProperties).toStrictEqual([{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}]);
    expect(wrapper.vm.definitionText).toBe("");
    expect(wrapper.vm.display).toBeFalsy();
    expect(wrapper.vm.types).toStrictEqual([{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]);
    expect(wrapper.vm.header).toBe("Scoliosis deformity of spine (disorder)");
    expect(wrapper.vm.dialogHeader).toBe("");
    expect(wrapper.vm.active).toBe(0);
    expect(wrapper.vm.contentHeight).not.toBe("");
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
  });

  it("inits and setsHeights on mounted", async() => {
    await flushPromises();
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
  });

  it("can check for a set ___ false", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    // console.log(wrapper.find("#members-container"));
    expect(wrapper.find("#members-container").exists()).toBeFalsy();
  });

  it("can check for a set ___ true", async() => {
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#VSET_ValueSet_359","name":"Concept set - Ethnicity","types":[{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}],"isa":[],"subtypes":[]}
    await wrapper.vm.$nextTick();
    await flushPromises();
    wrapper.vm.active = 3;
    await wrapper.vm.$nextTick();
    console.log(wrapper.find("#members-container"));
    expect(wrapper.find("#members-container").exists()).toBeTruthy();
  });
});


