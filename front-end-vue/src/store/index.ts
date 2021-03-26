import { SearchRequest } from './../models/search/SearchRequest';
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/User";
import AuthService from "@/services/AuthService";

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
    async logoutCurrentUser({ commit }){
      try {
        const res = await AuthService.signOut()
        if (res.status === 200){
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false)
          commit("updateAccessToken", null);
          commit("updateIdToken", null);
          commit("updateRefreshToken", null);
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
        commit("updateIdToken", res.idToken);
        commit("updateAccessToken", res.accessToken);
        commit("updateRefreshToken", res.refreshToken);
      } else {
        console.log(res.error);
        //refresh token call here?
        dispatch("logoutCurrentUser");
      }
    }
  },
  modules: {},
});
