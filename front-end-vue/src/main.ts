import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();

library.add(fas);

import "primevue/resources/themes/saga-blue/theme.css"; //theme

// import "primevue/resources/themes/md-light-indigo/theme.css"

import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";
import "./assets/layout/layout.scss";
import "./assets/layout/flags/flags.css";

// PrimeVue Components
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import InputText from "primevue/inputtext";
import Tree from "primevue/tree";
import Divider from "primevue/divider";
import Button from "primevue/button";
import Panel from "primevue/panel";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import ScrollPanel from "primevue/scrollpanel";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Listbox from "primevue/listbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import OrganizationChart from "primevue/organizationchart";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Tooltip from "primevue/tooltip";
import Dialog from "primevue/dialog";
import SplitButton from "primevue/splitbutton";
import MultiSelect from "primevue/multiselect";
import OverlayPanel from "primevue/overlaypanel";
import Chart from "primevue/chart";
import Menu from "primevue/menu";
import ProgressSpinner from "primevue/progressspinner";
import Menubar from "primevue/menubar";
import InlineMessage from "primevue/inlinemessage";
import Message from "primevue/message";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialogue from "primevue/confirmdialog";
import Avatar from "primevue/avatar";
import MegaMenu from "primevue/megamenu";
import Timeline from "primevue/timeline";
import SelectButton from "primevue/selectbutton";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

import { Amplify, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .use(ConfirmationService)
  .use(ToastService)
  .directive("tooltip", Tooltip)
  .component("Card", Card)
  .component("ProgressSpinner", ProgressSpinner)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .component("InputText", InputText)
  .component("Tree", Tree)
  .component("Divider", Divider)
  .component("Button", Button)
  .component("Panel", Panel)
  .component("Accordion", Accordion)
  .component("AccordionTab", AccordionTab)
  .component("ScrollPanel", ScrollPanel)
  .component("Splitter", Splitter)
  .component("SplitterPanel", SplitterPanel)
  .component("Listbox", Listbox)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("ColumnGroup", ColumnGroup)
  .component("OrganizationChart", OrganizationChart)
  .component("Textarea", Textarea)
  .component("DropDown", Dropdown)
  .component("Dialog", Dialog)
  .component("SplitButton", SplitButton)
  .component("MultiSelect", MultiSelect)
  .component("OverlayPanel", OverlayPanel)
  .component("Menu", Menu)
  .component("Chart", Chart)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("Menubar", Menubar)
  .component("InlineMessage", InlineMessage)
  .component("Message", Message)
  .component("ConfirmDialogue", ConfirmDialogue)
  .component("Avatar", Avatar)
  .component("MegaMenu", MegaMenu)
  .component("Timeline", Timeline)
  .component("SelectButton", SelectButton)
  .component("Toast", Toast)
  .mount("#app");
