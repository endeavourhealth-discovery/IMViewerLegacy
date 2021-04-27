import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";
import AuthService from "@/services/AuthService";
import { avatars } from "@/models/user/Avatars";
import { ConceptAggregate } from "@/models/TTConcept/ConceptAggregate";
import { Concept } from "@/models/TTConcept/Concept";
import { ConceptNode } from "@/models/TTConcept/ConceptNode";
import LoggerService from "@/services/LoggerService";
import { PieChartData } from "@/models/charts/PieChartData";
import { ConceptRole } from "@/models/TTConcept/ConceptRole";

export default createStore({
  state: {
    loading: new Map<string, boolean>(),
    conceptIri: "http://www.w3.org/2002/07/owl#Thing",
    conceptAggregate: {} as ConceptAggregate,
    mapped: [],
    usages: [],
    members: {} as any,
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
      let concept: Concept;
      let parents: Array<ConceptNode>;
      let children: Array<ConceptNode>;
      let properties: any;
      let roles: Array<ConceptRole>;
      Promise.all([
        await ConceptService.getConcept(iri).then(res => {
          concept = res.data;
        }),
        await ConceptService.getConceptParents(iri).then(res => {
          parents = res.data;
        }),
        await ConceptService.getConceptChildren(iri).then(res => {
          children = res.data;
        }),
        await ConceptService.getConceptProperties(iri).then(res => {
          properties = res.data;
        }),
        await ConceptService.getConceptRoles(iri).then(res => {
          roles = res.data;
        })
      ])
        .then(() => {
          const updated = new ConceptAggregate(
            concept,
            children,
            parents,
            properties,
            roles
          );
          commit("updateConceptAggregate", updated);
        })
        .catch(err => LoggerService.error(undefined, err));
    },
    async fetchConceptMapped({ commit }, iri) {
      commit("updateLoading", { key: "mapped", value: true });
      let mappedFrom: any;
      let mappedTo: any;
      Promise.all([
        await ConceptService.getConceptMappedFrom(iri).then(res => {
          mappedFrom = res.data;
        }),
        await ConceptService.getConceptMappedTo(iri).then(res => {
          mappedTo = res.data;
        })
      ])
        .then(() => {
          commit("updateConceptMapped", mappedFrom.concat(mappedTo));
          commit("updateLoading", { key: "mapped", value: false });
        })
        .catch(err => LoggerService.error(undefined, err));
    },
    async fetchConceptUsages({ commit }, iri) {
      commit("updateLoading", { key: "usages", value: true });
      let usages: any;
      await ConceptService.getConceptUsages(iri)
        .then(res => {
          usages = res.data;
          commit("updateConceptUsages", usages);
          commit("updateLoading", { key: "usages", value: false });
        })
        .catch(err => {
          LoggerService.error(undefined, err);
        });
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
          console.error(err);
          success = false;
        });
      commit("updateConceptMembers", members);
      commit("updateLoading", { key: "members", value: false });
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
            console.log("axios request cancelled");
          } else {
            success = "false";
            console.error(err);
          }
        });
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
          console.error(res.error);
          return res;
        }
      } catch (err) {
        console.error(err);
        return { status: 500, error: err, message: "Logout (store) failed" };
      }
    },
    async authenticateCurrentUser({ commit, dispatch }) {
      try {
        const res = await AuthService.getCurrentAuthenticatedUser();
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
          return { authenticated: true };
        } else {
          console.error(res.error);
          dispatch("logoutCurrentUser");
          return { authenticated: false };
        }
      } catch (err) {
        console.error(err);
        dispatch("logoutCurrentUser");
        return { authenticated: false };
      }
    }
  },
  modules: {}
});
