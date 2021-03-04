import { createStore } from "vuex";
import ConceptService from "../services/ConceptService";
import { HistoryItem } from "../models/HistoryItem";

export default createStore({
  state: {
    homeIri: "owl:Thing",
    ontologyIri: ":SemanticConcept",
    datamodelIri: ":DiscoveryCommonDataModel",
    valuesetIri: ":VSET_ValueSet",
    conceptAggregate: {} as any,
    history: [] as HistoryItem[],
  },
  mutations: {
    updateOntologyIri(state, ontologyIri) {
      state.ontologyIri = ontologyIri;
    },
    updateDatamodelIri(state, datamodelIri) {
      state.datamodelIri = datamodelIri;
    },
    updateValuesetIri(state, valuesetIri) {
      state.valuesetIri = valuesetIri;
    },
    updateConceptAggregate(state, conceptAggregate) {
      state.conceptAggregate = conceptAggregate;
    },
    updateHistory(state, historyItem) {
      state.history.push(historyItem);
      const uniqueList = state.history.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj.conceptName).indexOf(obj.conceptName) ===
          pos
        );
      });
      state.history = ([] as HistoryItem[]).concat(uniqueList).reverse();
    },
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      const concept = (await ConceptService.getConcept(iri)).data;
      const parents = (await ConceptService.getConceptParentHierarchy(iri))
        .data;
      const children = (await ConceptService.getConceptChildren(iri)).data;
      commit("updateConceptAggregate", {
        concept: concept,
        parents: parents,
        children: children,
      });
    },
  },
  modules: {},
});
