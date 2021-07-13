import { flushPromises, shallowMount } from "@vue/test-utils";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Dialog from "primevue/dialog";
import SelectButton from "primevue/selectbutton";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import EntityService from "@/services/EntityService";

describe("DownloadDialog.vue", () => {
  let wrapper: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockToast = {
      add: jest.fn()
    };
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ data: {"@id":"http://snomed.info/sct#298382003","http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"} });
    EntityService.getEntityParents = jest.fn().mockResolvedValue({ data: [{"name":"Curvature of spine (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#928000"}] });
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"}] });
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}}]});
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]});
    EntityService.getEntityMembers = jest.fn().mockResolvedValue({data: {"valueSet":{"name":"Family history","@id":"http://endhealth.info/im#VSET_RecordType_FamilyHistory"},"included":[{"entity":{"name":"Family history with explicit context (situation)","@id":"http://snomed.info/sct#57177007"},"code":"57177007","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"}}],"excluded":[{"entity":{"name":"No family history of clinical finding (situation)","@id":"http://snomed.info/sct#160266009"},"code":"160266009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"}}],"limited":false}});

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
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
  });
});
