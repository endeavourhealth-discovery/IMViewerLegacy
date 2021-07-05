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

describe("Concept.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockRouter: any;
  let mockToast: any;

  beforeEach(() => {
    jest.resetAllMocks();
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

  it("starts with data at empty values", () => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.setContentHeight = jest.fn();
    expect(wrapper.vm.editDialogView).toBeTruthy();
    expect(wrapper.vm.showDownloadDialog).toBeFalsy();
    expect(wrapper.vm.concept).toStrictEqual({});
    expect(wrapper.vm.semanticProperties).toStrictEqual([]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([]);
    expect(wrapper.vm.definitionText).toBe("");
    expect(wrapper.vm.display).toBeFalsy();
    expect(wrapper.vm.types).toStrictEqual([]);
    expect(wrapper.vm.header).toBe("");
    expect(wrapper.vm.dialogHeader).toBe("");
    expect(wrapper.vm.active).toBe(0);
    expect(wrapper.vm.contentHeight).toBe("");
    expect(wrapper.vm.contentHeightValue).toBe(0);
    expect(wrapper.vm.copyMenuItems).toStrictEqual([]);
  })
})
