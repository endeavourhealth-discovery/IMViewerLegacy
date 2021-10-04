import { flushPromises, shallowMount } from "@vue/test-utils";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Dialog from "primevue/dialog";
import SelectButton from "primevue/selectbutton";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";
import {OWL} from '@/vocabulary/OWL';

describe("DownloadDialog.vue", () => {
  const CONCEPT = {"@id":"http://snomed.info/sct#298382003","http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"};
  const INFERRED = {"entity":{"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}],"http://endhealth.info/im#roleGroup":[{"http://snomed.info/sct#116676008":{"@id":"http://snomed.info/sct#31739005","name":"Lateral abnormal curvature (morphologic abnormality)"},"http://snomed.info/sct#363698007":{"@id":"http://snomed.info/sct#289959001","name":"Musculoskeletal structure of spine (body structure)"}}]},"predicates":[{"name":"is a","@id":"http://endhealth.info/im#isA"},{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},{"name":"Finding site (attribute)","@id":"http://snomed.info/sct#363698007"},{"name":"role group","@id":"http://endhealth.info/im#roleGroup"}]};
  const AXIOMS = {"entity":{"@id":"http://snomed.info/sct#298382003","http://www.w3.org/2002/07/owl#equivalentClass":[{"http://www.w3.org/2002/07/owl#intersectionOf":[{"@id":"http://snomed.info/sct#64572001","name":"Disease (disorder)"},{"http://www.w3.org/2002/07/owl#someValuesFrom":{"http://www.w3.org/2002/07/owl#intersectionOf":[{"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://snomed.info/sct#31739005","name":"Lateral abnormal curvature (morphologic abnormality)"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://snomed.info/sct#116676008","name":"Associated morphology (attribute)"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}},{"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://snomed.info/sct#289959001","name":"Musculoskeletal structure of spine (body structure)"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://snomed.info/sct#363698007","name":"Finding site (attribute)"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}]},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://endhealth.info/im#roleGroup","name":"role group"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}]}]},"predicates":[{"name":"someValuesFrom","@id":"http://www.w3.org/2002/07/owl#someValuesFrom"},{"name":"onProperty","@id":"http://www.w3.org/2002/07/owl#onProperty"},{"name":"type","@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},{"name":"intersectionOf","@id":"http://www.w3.org/2002/07/owl#intersectionOf"},{"name":"equivalentClass","@id":"http://www.w3.org/2002/07/owl#equivalentClass"}]};
  const CHILDREN = [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"}];
  const DATA_MODEL = [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}}];
  const MEMBERS = {"valueSet":{"name":"Family history","@id":"http://endhealth.info/im#VSET_RecordType_FamilyHistory"},"members":[{"entity":{"name":"Family history with explicit context (situation)","@id":"http://snomed.info/sct#57177007"},"code":"57177007","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberIncluded"},{"entity":{"name":"No family history of clinical finding (situation)","@id":"http://snomed.info/sct#160266009"},"code":"160266009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"type":"MemberXcluded"}],"limited":false};
  const TERMS = [{"name":"Scoliosis deformity of spine","code":"439061010","scheme":"Snomed-CT namespace"},{"name":"Scoliosis","code":"439062015","scheme":"Snomed-CT namespace"},{"name":"Scoliosis deformity of spine (disorder)","code":"2153143014","scheme":"Snomed-CT namespace"}];

  let wrapper: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockToast = {
      add: jest.fn()
    };
    EntityService.getPartialEntity = jest.fn()
      .mockResolvedValueOnce({ data: CONCEPT })
      .mockResolvedValueOnce({ data: INFERRED })
      .mockResolvedValueOnce({ data: AXIOMS });
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: CHILDREN });
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data: DATA_MODEL });
    EntityService.getEntityMembers = jest.fn().mockResolvedValue({data: MEMBERS });
    EntityService.getEntityTermCodes = jest.fn().mockResolvedValue({data: TERMS });

    wrapper = shallowMount(DownloadDialog, {
      global: {
        components: { Dialog, SelectButton, Checkbox, Button, ProgressSpinner },
        mocks: { $toast: mockToast }
      },
      props: { conceptIri: "http://snomed.info/sct#298382003", showDialog: true }
    });
  });

  it("inits on mounted", async() => {
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(3);
  });

  it("inits on conceptIri change", () => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.init).toHaveBeenCalledWith("http://endhealth.info/im#DiscoveryOntology");
  });

  it("emits on closeDownloadDialog", () => {
    wrapper.vm.closeDownloadDialog();
    expect(wrapper.emitted().closeDownloadDialog).toBeTruthy();
  });

  it("can downloadConcept ___ success", () => {
    wrapper.vm.closeDownloadDialog = jest.fn();
    window.open = jest.fn().mockReturnValue(true);
    wrapper.vm.downloadConcept();
    expect(wrapper.vm.closeDownloadDialog).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/test/api/entity/download?iri=http:%2F%2Fsnomed.info%2Fsct%23298382003&format=excel&hasSubTypes=true&dataModelProperties=true&members=true&expandMembers=false&inferred=true&axioms=false&terms=false&isChildOf=false&hasChildren=false&inactive=false");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Download will begin shortly"));
  });

  it("can downloadConcept ___ fail", () => {
    wrapper.vm.closeDownloadDialog = jest.fn();
    window.open = jest.fn().mockReturnValue(false);
    wrapper.vm.downloadConcept();
    expect(wrapper.vm.closeDownloadDialog).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("/test/api/entity/download?iri=http:%2F%2Fsnomed.info%2Fsct%23298382003&format=excel&hasSubTypes=true&dataModelProperties=true&members=true&expandMembers=false&inferred=true&axioms=false&terms=false&isChildOf=false&hasChildren=false&inactive=false");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Download failed from server"));
  });

  it("Inits ___ success", async() => {
    await flushPromises();
    // jest.clearAllMocks();
    wrapper.vm.setIncludeBooleans = jest.fn();
    // wrapper.vm.init("http://snomed.info/sct#298382003");
    // expect(wrapper.vm.loading).toBe(true);
    // await flushPromises();
    // await wrapper.vm.$nextTick();
    // expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    // // expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN]);
    // // expect(EntityService.getPartialEntity).toHaveBeenNthCalledWith("http://snomed.info/sct#298382003", [IM.IS_A, IM.ROLE_GROUP]);
    // expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", [RDFS.SUBCLASS_OF, RDFS.SUB_PROPERTY_OF, OWL.EQUIVALENT_CLASS]);
    // expect(wrapper.vm.concept).toStrictEqual(CONCEPT);
    // expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    // expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    // expect(wrapper.vm.terms).toStrictEqual(TERMS);
    // expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    // expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    // expect(wrapper.vm.hasSubTypes).toStrictEqual(CHILDREN);
    // expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    // expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    // expect(wrapper.vm.dataModelProperties).toStrictEqual(DATA_MODEL);
    // expect(wrapper.vm.inferred).toStrictEqual(INFERRED);
    // expect(wrapper.vm.axioms).toStrictEqual(AXIOMS);
    // expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    // expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://snomed.info/sct#298382003", false, false);
    // expect(wrapper.vm.members).toStrictEqual(MEMBERS);
    // expect(wrapper.vm.setIncludeBooleans).toHaveBeenCalledTimes(1);
    // expect(wrapper.vm.loading).toBe(false);
  });

  it("Inits ___ fail", async() => {
    console.error = jest.fn();
    EntityService.getPartialEntity = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityParents = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityChildren = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getDataModelProperties = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityMembers = jest.fn().mockRejectedValue({ code: 403, message: "Test error" });
    EntityService.getEntityTermCodes = jest.fn().mockRejectedValue({code: 403, message: "Test error"});
    await flushPromises();
    jest.clearAllMocks();
    wrapper.vm.setIncludeBooleans = jest.fn();
    wrapper.vm.init("http://snomed.info/sct#298382003");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(3);
    expect(EntityService.getPartialEntity).toHaveBeenNthCalledWith(1,"http://snomed.info/sct#298382003", [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN]);
    expect(EntityService.getPartialEntity).toHaveBeenNthCalledWith(2,"http://snomed.info/sct#298382003", [IM.IS_A, IM.ROLE_GROUP]);
    expect(EntityService.getPartialEntity).toHaveBeenNthCalledWith(3,"http://snomed.info/sct#298382003", [RDFS.SUBCLASS_OF, RDFS.SUB_PROPERTY_OF, OWL.EQUIVALENT_CLASS]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");

    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://snomed.info/sct#298382003", false, false);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(mockToast.add).toHaveBeenCalledTimes(7);
    expect(mockToast.add).toHaveBeenNthCalledWith(1, LoggerService.error("Failed to get concept data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(2, LoggerService.error("Failed to get inferred data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(3, LoggerService.error("Failed to get axiom data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(4, LoggerService.error("Failed to get children data from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(5, LoggerService.error("Failed to get terms from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(6, LoggerService.error("Failed to get data model properties from server"));
    expect(mockToast.add).toHaveBeenNthCalledWith(7, LoggerService.error("Failed to get members from server"));
    expect(wrapper.vm.setIncludeBooleans).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("Can setIncludeBooleans ___ members", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.setIncludeBooleans();
    expect(wrapper.vm.includeInferred).toBe(true);
    expect(wrapper.vm.includeAxioms).toBe(true);
    expect(wrapper.vm.includeHasSubTypes).toBe(true);
    expect(wrapper.vm.includeDataModelProperties).toBe(true);
    expect(wrapper.vm.includeMembers).toBe(true);
  });

  it("Can setIncludeBooleans ___ no members", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    wrapper.vm.members = {};
    wrapper.vm.setIncludeBooleans();
    expect(wrapper.vm.includeInferred).toBe(true);
    expect(wrapper.vm.includeAxioms).toBe(true);
    expect(wrapper.vm.includeHasSubTypes).toBe(true);
    expect(wrapper.vm.includeDataModelProperties).toBe(true);
    expect(wrapper.vm.includeMembers).toBe(false);
  });
});
