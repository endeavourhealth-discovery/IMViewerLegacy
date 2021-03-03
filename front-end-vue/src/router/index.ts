import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Datamodel from "../views/Datamodel.vue";
import Ontology from "../views/Ontology.vue";
import Valueset from "../views/Valueset.vue";
import store from "@/store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/datamodel/:selectedIri",
    name: "Datamodel",
    component: Datamodel,
  },
  {
    path: "/ontology/:selectedIri",
    name: "Ontology",
    component: Ontology
  },
  {
    path: "/valueset/:selectedIri",
    name: "Valueset",
    component: Valueset
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
    console.log("iri" + to.params.selectedIri);
    console.log("route" + to.name?.toString());
    if( to.name?.toString() == "Datamodel") {
      store.commit("updateDatamodelIri", to.params.selectedIri as string);
      store.dispatch("fetchConceptAggregate", store.state.datamodelIri);
    }

    if( to.name?.toString() == "Ontology") {
      store.commit("updateOntologyIri", to.params.selectedIri as string);
      store.dispatch("fetchConceptAggregate", store.state.ontologyIri);
    }

    if( to.name?.toString() == "Valueset") {
      store.commit("updateValuesetIri", to.params.selectedIri as string);
      store.dispatch("fetchConceptAggregate", store.state.valuesetIri);
    }
    next();
})

export default router;
