import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/User";
import AuthService from "@/services/AuthService";

export default createStore({
  state: {
    loading: new Map<string, boolean>(),
    conceptIri: "http://www.w3.org/2002/07/owl#Thing",
    conceptAggregate: {} as any,
    mapped: [],
    usages: [],
    members: [],
    history: [] as HistoryItem[],
    searchResults: [],
    currentUser: {} as User,
    registeredUsername: "" as string,
    isLoggedIn: false as boolean,
    filters: {
      selectedStatus: ["Active", "Draft"],
      selectedSchemes: [
        {
          iri: "http://endhealth.info/im#891071000252105",
          name: "Discovery code"
        },
        {
          iri: "http://endhealth.info/im#891101000252101",
          name: "Snomed-CT code"
        },
        {
          iri: "http://endhealth.info/im#891111000252103",
          name: "Term based code"
        }
      ],
      selectedTypes: [
        "Class",
        "ObjectProperty",
        "DataProperty",
        "DataType",
        "Annotation",
        "Individual",
        "Record",
        "ValueSet",
        "Folder",
        "Legacy"
      ]
    }
  },
  mutations: {
    updateConceptIri(state, conceptIri) {
      state.conceptIri = conceptIri;
    },
    updateConceptAggregate(state, conceptAggregate) {
      state.conceptAggregate = conceptAggregate;
    },
    updateConceptMapped(state, mapped) {
      state.mapped = mapped;
    },
    updateConceptUsages(state, usages) {
      state.usages = usages;
    },
    updateConceptMembers(state, members) {
      state.members = members;
    },
    updateHistory(state, historyItem) {
      state.history = state.history.filter(function(el) {
        return el.url !== historyItem.url;
      });
      state.history.splice(0, 0, historyItem);
    },
    updateSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    updateFilters(state, filters) {
      state.filters = filters;
    },
    updateLoading(state, loading) {
      state.loading.set(loading.key, loading.value);
    },
    updateCurrentUser(state, user) {
      state.currentUser = user;
    },
    updateRegisteredUsername(state, username) {
      state.registeredUsername = username;
    },
    updateIsLoggedIn(state, status) {
      state.isLoggedIn = status;
    }
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      let concept: any;
      let parents: any;
      let children: any;
      let properties: any;
      let success = true;
      await ConceptService.getConcept(iri)
        .then(res => {
          concept = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      await ConceptService.getConceptParents(iri)
        .then(res => {
          parents = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      await ConceptService.getConceptChildren(iri)
        .then(res => {
          children = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      await ConceptService.getConceptProperties(iri)
        .then(res => {
          properties = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      commit("updateConceptAggregate", {
        concept: concept,
        parents: parents,
        children: children,
        properties: properties
      });
      return success;
    },
    async fetchConceptMapped({ commit }, iri) {
      commit("updateLoading", { key: "mapped", value: true });
      let mappedFrom: any;
      let mappedTo: any;
      let success = true;
      await ConceptService.getConceptMappedFrom(iri)
        .then(res => {
          mappedFrom = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      await ConceptService.getConceptMappedTo(iri)
        .then(res => {
          mappedTo = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      commit("updateConceptMapped", mappedFrom.concat(mappedTo));
      commit("updateLoading", { key: "mapped", value: false });
      return success;
    },
    async fetchConceptUsages({ commit }, iri) {
      commit("updateLoading", { key: "usages", value: true });
      let usages: any;
      let success = true;
      await ConceptService.getConceptUsages(iri)
        .then(res => {
          usages = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      commit("updateConceptUsages", usages);
      commit("updateLoading", { key: "usages", value: false });
      return success;
    },
    async fetchConceptMembers({ commit }, iri) {
      commit("updateLoading", { key: "members", value: true });
      let members: any;
      let success = true;
      await ConceptService.getConceptMembers(iri, false)
        .then(res => {
          members = res.data;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      commit("updateConceptMembers", members);
      commit("updateLoading", { key: "members", value: false });
      return success;
    },
    async fetchSearchResults({ commit }, searchRequest: SearchRequest) {
      commit("updateLoading", { key: "searchResults", value: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      let searchResults: any;
      let success = true;
      await ConceptService.advancedSearch(searchRequest)
        .then(res => {
          searchRequest = res.data.concepts;
        })
        .catch(err => {
          console.log(err);
          success = false;
        });
      commit("updateSearchResults", searchResults);
      commit("updateLoading", { key: "searchResults", value: false });
      return success;
    },
    async logoutCurrentUser({ commit }) {
      try {
        const res = await AuthService.signOut();
        if (res.status === 200) {
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false);
          return res;
        } else {
          console.log(res.error);
          return res;
        }
      } catch (err) {
        console.log(err);
        return { status: 500, error: err, message: "Logout (store) failed" };
      }
    },
    async authenticateCurrentUser({ commit, dispatch }) {
      try {
        const res = await AuthService.getCurrentAuthenticatedUser();
        if (res.status === 200) {
          commit("updateIsLoggedIn", true);
          commit("updateCurrentUser", res.user);
          return { authenticated: true };
        } else {
          console.log(res.error);
          dispatch("logoutCurrentUser");
          return { authenticated: false };
        }
      } catch (err) {
        console.log(err);
        dispatch("logoutCurrentUser");
        return { authenticated: false };
      }
    }
  },
  modules: {}
});
