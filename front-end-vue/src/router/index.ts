import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  viewDepthKey,
} from "vue-router";
import Home from "../views/Home.vue";
import Datamodel from "../views/Concept.vue";
import User from "../views/user/User.vue";
import Login from "../views/user/Login.vue";
import Register from "../views/user/Register.vue";
import UserDetails from "../views/user/UserDetails.vue";
import UserEdit from "../views/user/UserEdit.vue";
import { HistoryItem } from "../models/HistoryItem";
import store from "@/store/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "User",
    component: User,
    children: [
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "register",
        name: "Register",
        component: Register
      },
      {
        path: ":id",
        name: "UserDetails",
        component: UserDetails
      },
      {
        path: ":id/edit",
        name: "UserEdit",
        component: UserEdit
      }
    ]
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    alias: "/"
  },
  {
    path: "/concept/:selectedIri",
    name: "Concept",
    component: Datamodel,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("iri" + to.params.selectedIri);
  console.log("route" + to.name?.toString());
  if (to.name?.toString() == "Concept") {
    store.commit("updateConceptIri", to.params.selectedIri as string);
    store.dispatch("fetchConceptAggregate", store.state.conceptIri);
  }
  // if ((to.name === 'UserDetails' || to.name === 'UserEdit') && !isAuthenticated) next ({ name: 'Login' })
  next();
});

export default router;
