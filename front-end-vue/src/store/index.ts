import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";
import AuthService from "@/services/AuthService";
import { avatars } from "@/models/user/Avatars";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { ConceptNode } from "@/models/TTConcept/ConceptNode";
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { ConceptRole } from "@/models/TTConcept/ConceptRole";
import { Member } from "@/models/members/Member";
import { CustomAlert } from "@/models/user/CustomAlert";

export default createStore({
  state: {
    loading: new Map<string, boolean>(),
    conceptIri: "http://www.w3.org/2002/07/owl#Thing",
    conceptAggregate: {} as ConceptAggregate,
    mapped: [],
    usages: [],
    members: {} as Member,
    history: [] as HistoryItem[],
    searchResults: [],
    currentUser: {} as User,
    registeredUsername: "" as string,
    isLoggedIn: false as boolean,
    snomedLicenseAccepted: localStorage.getItem(
      "snomedLicenseAccepted"
    ) as string,
    historyCount: 0 as number,
    // strip out ontologyOverview, conceptTypes/Status/Schemes when server caching is complete
    ontologyOverview: [],
    conceptTypes: {} as PieChartData,
    conceptSchemes: {} as PieChartData,
    conceptStatus: {} as PieChartData,
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
    },
    updateSnomedLicenseAccepted(state, status: string) {
      state.snomedLicenseAccepted = status;
      localStorage.setItem("snomedLicenseAccepted", status);
    },
    updateHistoryCount(state, count) {
      state.historyCount = count;
    },
    // strip out ontologyOverview, conceptTypes/Status/Schemes when server caching is complete
    updateOntologyOverview(state, tableData) {
      state.ontologyOverview = tableData;
    },
    updateConceptTypes(state, chartConceptTypes) {
      state.conceptTypes = chartConceptTypes;
    },
    updateConceptSchemes(state, chartConceptSchemes) {
      state.conceptSchemes = chartConceptSchemes;
    },
    updateConceptStatus(state, chartConceptStatus) {
      state.conceptStatus = chartConceptStatus;
    }
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      let concept: any;
      let parents: Array<ConceptNode>;
      let children: Array<ConceptNode>;
      let graph: any;
      let success = true;
      await Promise.all([
        ConceptService.getConcept(iri).then(res => {
          concept = res.data;
        }),
        ConceptService.getConceptParents(iri).then(res => {
          parents = res.data;
        }),
        ConceptService.getConceptChildren(iri).then(res => {
          children = res.data;
        }),
        ConceptService.getConceptGraph(iri).then(res => {
          graph = res.data;
        }),
      ])
        .then(() => {
          const updated = new ConceptAggregate(
            concept,
            children,
            parents,
            graph
          );
          commit("updateConceptAggregate", updated);
        })
        .catch(err => {
          LoggerService.error(undefined, err);
          success = false;
        });
      return success;
    },
    async fetchConceptMapped({ commit }, iri) {
      commit("updateLoading", { key: "mapped", value: true });
      let mappedFrom: any;
      let mappedTo: any;
      let success = true;
      await Promise.all([
        ConceptService.getConceptMappedFrom(iri).then(res => {
          mappedFrom = res.data;
        }),
        ConceptService.getConceptMappedTo(iri).then(res => {
          mappedTo = res.data;
        })
      ])
        .then(() => {
          commit("updateConceptMapped", mappedFrom.concat(mappedTo));
          commit("updateLoading", { key: "mapped", value: false });
        })
        .catch(err => {
          success = false;
          LoggerService.error(undefined, err);
          commit("updateLoading", { key: "mapped", value: false });
        });
      return success;
    },
    async fetchConceptUsages({ commit }, iri) {
      commit("updateLoading", { key: "usages", value: true });
      let usages: any;
      let success = true;
      await ConceptService.getConceptUsages(iri)
        .then(res => {
          usages = res.data;
          commit("updateConceptUsages", usages);
          commit("updateLoading", { key: "usages", value: false });
        })
        .catch(err => {
          LoggerService.error(undefined, err);
          success = false;
          commit("updateLoading", { key: "usages", value: false });
        });
      return success;
    },
    async fetchConceptMembers({ commit }, iri) {
      commit("updateLoading", { key: "members", value: true });
      let members: Member;
      let success = true;
      await ConceptService.getConceptMembers(iri, false)
        .then(res => {
          members = res.data;
          commit("updateConceptMembers", members);
          commit("updateLoading", { key: "members", value: false });
        })
        .catch(err => {
          LoggerService.error(undefined, err);
          success = false;
          commit("updateLoading", { key: "members", value: false });
        });
      return success;
    },
    async fetchSearchResults(
      { commit },
      data: { searchRequest: SearchRequest; cancelToken: any }
    ) {
      let searchResults: any;
      let success = "true";
      await ConceptService.advancedSearch(data.searchRequest, data.cancelToken)
        .then(res => {
          searchResults = res.data.concepts;
          commit("updateSearchResults", searchResults);
        })
        .catch(err => {
          if (!err.message) {
            success = "cancelled";
            LoggerService.info(undefined, "axios request cancelled");
          } else {
            success = "false";
            LoggerService.error(undefined, err);
          }
        });
      return success;
    },
    async logoutCurrentUser({ commit }) {
      let result = new CustomAlert(500, "Logout (store) failed");
      await AuthService.signOut()
      .then(res => {
        if (res.status === 200) {
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false);
          result = res;
        } else {
          result = res;
        }
      })
      .catch(err => {
        LoggerService.error(undefined, err);
      })
      return result
    },
    async authenticateCurrentUser({ commit, dispatch }) {
      const result = { authenticated: false };
      await AuthService.getCurrentAuthenticatedUser()
      .then(res => {
        if (res.status === 200 && res.user) {
          commit("updateIsLoggedIn", true);
          const loggedInUser = res.user;
          if ("value" in loggedInUser.avatar) {
            const result = avatars.find(
              avatar => avatar.value === loggedInUser.avatar.value
            );
            if (!result) {
              loggedInUser.avatar = avatars[0];
            }
          } else {
            loggedInUser.avatar = avatars[0];
          }
          commit("updateCurrentUser", loggedInUser);
          result.authenticated = true;
        } else {
          dispatch("logoutCurrentUser");
        }
      })
      .catch (err => {
        LoggerService.error(undefined, err);
        dispatch("logoutCurrentUser");
      });
      return result;
    }
  },
  modules: {}
});
