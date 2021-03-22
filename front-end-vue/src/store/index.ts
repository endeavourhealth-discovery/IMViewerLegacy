import { ConceptType } from './../models/search/ConceptType';
import { SearchRequest } from './../models/search/SearchRequest';
import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";

export default createStore({
  state: {
    conceptIri: "owl:Thing",
    conceptAggregate: {} as any,
    history: [] as HistoryItem[],
    searchResults: [],
    filters: {
      selectedStatus: ["Active", "Draft"],
      selectedSchemes: [
        {
          iri: ":891071000252105",
          name: "Discovery code"
        },
        {
          iri: ":891101000252101",
          name: "Snomed-CT code"
        },
        {
          iri: ":891111000252103",
          name: "Term based code"
        }
      ],
      selectedTypes: ["Class", "ObjectProperty", "DataProperty", "DataType", "Annotation", "Individual", "Record", "ValueSet", "Folder", "Term", "Legacy", "CategoryGroup"]
    }
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
    updateFilters(state, filters) {
      state.filters = filters;
    },

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
      const members = (await ConceptService.getConceptMembers(iri)).data;
      commit("updateConceptAggregate", {
        concept: concept,
        parents: parents,
        children: children,
        mapped: mappedFrom.concat(mappedTo),
        usages: usages,
        properties: properties,
        members: members
      });
    },
    async fetchSearchResults({ commit }, searchRequest: SearchRequest) {
      const searchResults = (await ConceptService.advancedSearch(searchRequest)).data.concepts;
      commit("updateSearchResults", searchResults)
    }
  },
  modules: {},
});
