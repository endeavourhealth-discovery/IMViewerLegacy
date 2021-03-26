import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  viewDepthKey
} from "vue-router";
import Home from "../views/Home.vue";
import Datamodel from "../views/Concept.vue";
import { HistoryItem } from "../models/HistoryItem";
import store from "@/store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/concept/:selectedIri",
    name: "Concept",
    component: Datamodel
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  console.log("iri" + to.params.selectedIri);
  console.log("route" + to.name?.toString());
  if (to.name?.toString() == "Concept") {
    store.commit("updateConceptIri", to.params.selectedIri as string);
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
    store.dispatch("fetchConceptMapped", store.state.conceptIri);
    store.dispatch("fetchConceptUsages", store.state.conceptIri);
    store.dispatch("fetchConceptMembers", store.state.conceptIri);
  }
  next();
});

export default router;
