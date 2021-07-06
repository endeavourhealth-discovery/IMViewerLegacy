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
  let wrapper;
  let mockStore;
  let mockRouter;
  let mockToast;

  beforeEach(() => {
    jest.resetAllMocks();
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
    console.error = jest.fn();

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
    expect(Concept.computed.isSet.call({concept: {types: [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]}})).toBe(false);
  });

  it("can check for a set ___ true", async() => {
    expect(Concept.computed.isSet.call({concept: {types: [{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}]}})).toBe(true);
  });

  it("can check isClass ___ true", () => {
    expect(Concept.computed.isClass.call({concept: {types: [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]}})).toBe(true);
  });

  it("can check isClass ___ false", () => {
    expect(Concept.computed.isClass.call({concept: {types: [{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}]}})).toBe(false);
  });

  it("inits on iri change", async() => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
  });

  it("updates copyMenuItems on concept change", async() => {
    wrapper.vm.setCopyMenuItems = jest.fn();
    wrapper.vm.$options.watch.concept.call(wrapper.vm, {"iri":"http://snomed.info/sct#298591003","name":"Scoliosis of lumbar spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Deformity of lumbar spine (finding)","@id":"http://snomed.info/sct#298589006"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"},{"name":"Disorder of lumbar spine (disorder)","@id":"http://snomed.info/sct#129139009"}],"subtypes":[{"name":"Idiopathic scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#712581001"}]});
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.setCopyMenuItems).toHaveBeenCalledTimes(1);
  });

  it("can update focusTree", () => {
    wrapper.vm.focusTree();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateFocusTree", true);
  });

  it("can routeToEdit", async() => {
    await flushPromises();
    wrapper.vm.directToEditRoute();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "Edit",
      params: { iri: "http://snomed.info/sct#298382003" }
    });
  });

  it("can route to create", () => {
    wrapper.vm.directToCreateRoute();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Create" });
  });

  it("can getConcept ___ pass", async() => {
    EntityService.getEntityDefinitionDto = jest.fn().mockResolvedValue({data:{"iri":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired curvature of spine (disorder)","@id":"http://snomed.info/sct#12903001"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"}],"subtypes":[{"name":"Acquired kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#405771009"},{"name":"Adolescent idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203646004"},{"name":"Infantile idiopathic scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#310421000119106"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis caused by radiation (disorder)","@id":"http://snomed.info/sct#47518006"},{"name":"Thoracogenic scoliosis (disorder)","@id":"http://snomed.info/sct#72992003"}]}});
    wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#111266001");
    expect(wrapper.vm.concept).toStrictEqual({"iri":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired curvature of spine (disorder)","@id":"http://snomed.info/sct#12903001"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"}],"subtypes":[{"name":"Acquired kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#405771009"},{"name":"Adolescent idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203646004"},{"name":"Infantile idiopathic scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#310421000119106"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis caused by radiation (disorder)","@id":"http://snomed.info/sct#47518006"},{"name":"Thoracogenic scoliosis (disorder)","@id":"http://snomed.info/sct#72992003"}]});
  });

  it("can getConcept ___ fail", async() => {
    EntityService.getEntityDefinitionDto = jest.fn().mockRejectedValue({code: 403, message: "test message"});
    wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#111266001");
    expect(mockToast.add).toHaveBeenCalledTimes(2);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get concept definition dto from server", {code: 403, message: "test message"}));
  });

  it("can get properties ___ pass both", async() => {
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data:[{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]});
    wrapper.vm.getProperties("http://endhealth.info/im#CriticalCareEncounter");
    await flushPromises();
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(wrapper.vm.semanticProperties).toStrictEqual([{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]);
  });

  it("Inits", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"iri":"http://snomed.info/sct#47518006","name":"Scoliosis caused by radiation (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Radiation therapy complication (disorder)","@id":"http://snomed.info/sct#212904005"},{"name":"Disorder of musculoskeletal system following procedure (disorder)","@id":"http://snomed.info/sct#724614007"},{"name":"Deformity of spine due to injury (disorder)","@id":"http://snomed.info/sct#442544003"}],"subtypes":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(wrapper.vm.getProperties).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.getConcept).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.getConcept).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.types).toStrictEqual([{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]);
    expect(wrapper.vm.header).toBe("Scoliosis caused by radiation (disorder)");
  });

  it("can openDownloadDialog", async() => {
    wrapper.vm.openDownloadDialog();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDownloadDialog).toBe(true);
  });

  it("can closeDialog", async() => {
    wrapper.vm.closeDownloadDialog();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDownloadDialog).toBe(false);
  });

  it("can copy concept to clipboard", () => {
    expect(wrapper.vm.copyConceptToClipboard({"iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]})).toBe("Name: Scoliosis deformity of spine (disorder),\nIri: http://snomed.info/sct#298382003,\nStatus: Active,\nTypes: [\n\tClass\n],\nIs-a: [\n\tCurvature of spine (disorder),\n\tDisorder of musculoskeletal system (disorder),\n\tDisorder of vertebral column (disorder)\n],\nSubtypes: [\n\tAcquired scoliosis (disorder),\n\tAcrodysplasia scoliosis (disorder),\n\tCongenital scoliosis due to bony malformation (disorder),\n\tDistal arthrogryposis type 4 (disorder),\n\tDuane anomaly, myopathy, scoliosis syndrome (disorder),\n\tHorizontal gaze palsy with progressive scoliosis (disorder),\n\tIdiopathic scoliosis (disorder),\n\tIdiopathic scoliosis AND/OR kyphoscoliosis (disorder),\n\tKyphoscoliosis and scoliosis (disorder),\n\tKyphoscoliosis deformity of spine (disorder),\n\tLordoscoliosis (disorder),\n\tNeuromuscular scoliosis (disorder),\n\tPostural scoliosis (disorder),\n\tRadioulnar synostosis with microcephaly and scoliosis syndrome (disorder),\n\tScoliosis in connective tissue anomalies (disorder),\n\tScoliosis in neurofibromatosis (disorder),\n\tScoliosis in skeletal dysplasia (disorder),\n\tScoliosis of cervical spine (disorder),\n\tScoliosis of lumbar spine (disorder),\n\tScoliosis of thoracic spine (disorder)\n],\nSemantic properties: [\n\tAssociated morphology (attribute)\n],\nData model properties: [\n\t\n]");
  });

  it("toasts onCopy", () => {
    wrapper.vm.onCopy();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Value copied to clipboard"));
  });

  it("toasts onCopyError", () => {
    wrapper.vm.onCopyError();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to copy value to clipboard"));
  });
});


