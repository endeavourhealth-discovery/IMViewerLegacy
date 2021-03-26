import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/User";
import AuthService from "@/services/AuthService";

export default createStore({
  state: {
    loading: new Map<string, boolean>(),
    conceptIri: "owl:Thing",
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
          iri: ":891071000252105",
          name: "Discovery code",
        },
        {
          iri: ":891101000252101",
          name: "Snomed-CT code",
        },
        {
          iri: ":891111000252103",
          name: "Term based code",
        },
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
        "Term",
        "Legacy",
        "CategoryGroup",
      ],
    },
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
    updateCurrentUser(state, user){
      state.currentUser = user;
    },
    updateRegisteredUsername(state, username){
      state.registeredUsername = username;
    },
    updateIsLoggedIn(state, status){
      state.isLoggedIn = status;
    },
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      const concept = (await ConceptService.getConcept(iri)).data;
      const parents = (await ConceptService.getConceptParentHierarchy(iri))
        .data;
      const children = (await ConceptService.getConceptChildren(iri)).data;
      const properties = (await ConceptService.getConceptProperties(iri)).data;
      commit("updateConceptAggregate", {
        concept: concept,
        parents: parents,
        children: children,
        properties: properties,
      });
    },
    async fetchConceptMapped({ commit }, iri) {
      commit("updateLoading", { key: "mapped", value: true });
      const mappedFrom = (await ConceptService.getConceptMappedFrom(iri)).data;
      const mappedTo = (await ConceptService.getConceptMappedTo(iri)).data;
      commit("updateConceptMapped", mappedFrom.concat(mappedTo));
      commit("updateLoading", { key: "mapped", value: false });
    },
    async fetchConceptUsages({ commit }, iri) {
      commit("updateLoading", { key: "usages", value: true });
      const usages = (await ConceptService.getConceptUsages(iri)).data;
      commit("updateConceptUsages", usages);
      commit("updateLoading", { key: "usages", value: false });
    },
    async fetchConceptMembers({ commit }, iri) {
      commit("updateLoading", { key: "members", value: true });
      const members = (await ConceptService.getConceptMembers(iri, false)).data;
      commit("updateConceptMembers", members);
      commit("updateLoading", { key: "members", value: false });
    },
    async fetchSearchResults({ commit }, searchRequest: SearchRequest) {
      commit("updateLoading", { key: "searchResults", value: true });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const searchResults = (await ConceptService.advancedSearch(searchRequest))
          .data.concepts;
      commit("updateSearchResults", searchResults);
      commit("updateLoading", { key: "searchResults", value: false });
    },
    async logoutCurrentUser({ commit }){
      try {
        const res = await AuthService.signOut()
        if (res.status === 200){
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false)
          return res;
        } else {
          console.log(res.error);
          return res
        }
      } catch (err) {
        console.log(err)
        return {status: 500, error: err, message: "Logout (store) failed"}
      }
    },
    async authenticateCurrentUser({ commit, dispatch }){
      const res = await AuthService.getCurrentAuthenticatedUser();
      if (res.status === 200){
        commit("updateIsLoggedIn", true);
        commit("updateCurrentUser", res.user);
        return {authenticated: true};
      } else {
        console.log(res.error);
        //refresh token call here?
        dispatch("logoutCurrentUser");
        return {authenticated: false};
      }
    }
  },
  modules: {},
});
