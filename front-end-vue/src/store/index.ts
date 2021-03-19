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
    user: {} as User,
    token: "" as string,
    refreshToken: "" as string,
    isAuthenticated: false as boolean,
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
    updateUser(state, user){
      state.user = user;
    },
    updateIsAuthenticated(state, authStatus){
      state.isAuthenticated = authStatus;
    },
    updateIsLoggedIn(state, status){
      state.isLoggedIn = status
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
    async getUser({ commit }, token: string){
      // after UserService exists
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
