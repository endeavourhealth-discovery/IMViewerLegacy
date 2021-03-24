import { SearchRequest } from './../models/search/SearchRequest';
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/User";

export default createStore({
  state: {
    conceptIri: "owl:Thing",
    conceptAggregate: {} as any,
    history: [] as HistoryItem[],
    searchResults: [],
    currentUser: {} as User,
    registeredUsername: "" as string,
    accessToken: localStorage.getItem("accessToken") as string,
    idToken: localStorage.getItem("idToken") as string,
    refreshToken: localStorage.getItem("refreshToken") as string,
    isLoggedIn: false as boolean
  },
  mutations: {
    updateConceptIri(state, conceptIri) {
      state.conceptIri = conceptIri;
    },
    updateConceptAggregate(state, conceptAggregate) {
      state.conceptAggregate = conceptAggregate;
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
    updateCurrentUser(state, user){
      state.currentUser = user;
    },
    updateRegisteredUsername(state, username){
      state.registeredUsername = username;
    },
    updateIsLoggedIn(state, status){
      state.isLoggedIn = status;
    },
    updateAccessToken(state, token){
      localStorage.setItem("accessToken", token);
    },
    updateIdToken(state, token){
      localStorage.setItem("idToken", token);
    },
    updateRefreshToken(state, token){
      localStorage.setItem("refreshToken", token);
    }
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      const concept = (await ConceptService.getConcept(iri)).data;
      const parents = (await ConceptService.getConceptParentHierarchy(iri))
        .data;
      const children = (await ConceptService.getConceptChildren(iri)).data;
      const mappedFrom = (await ConceptService.getConceptMappedFrom(iri)).data;
      const mappedTo = (await ConceptService.getConceptMappedTo(iri)).data;
      const usages = (await ConceptService.getConceptUsages(iri)).data;
      const properties = (await ConceptService.getConceptProperties(iri)).data;
      commit("updateConceptAggregate", {
        concept: concept,
        parents: parents,
        children: children,
        mappedFrom: mappedFrom,
        mappedTo: mappedTo,
        usages: usages,
        properties: properties
      });
    },
    async fetchSearchResults({ commit }, searchRequest: SearchRequest) {
      const searchResults = (await ConceptService.advancedSearch(searchRequest)).data.concepts;
      commit("updateSearchResults", searchResults)
    },
    logoutCurrentUser({ commit }){
      commit("updateCurrentUser", undefined);
      commit("updateIsLoggedIn", false)
      commit("updateAccessToken", "");
      commit("updateIdToken", "");
      commit("updateRefreshToken", "");
    }
    // async authenticateToken({ commit }){
    //   if (){ // finish once AWS cognito is setup
    //     commit("updateIsAuthenticated", true)
    //   } else {
    //     commit("updateIsAuthenticated", false)
    //   }
    // }
  },
  modules: {},
});
