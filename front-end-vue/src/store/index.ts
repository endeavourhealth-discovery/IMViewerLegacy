import { createStore } from "vuex";
import ConceptService from "../services/ConceptService"

export default createStore({
  state: {
    homeIri: "owl:Thing",
    ontologyIri: ":HealthRecord",
    datamodelIri: ":SemanticConcept",
    valuesetIri: ":VSET_ValueSet",
    conceptAggregate: {} as any
  },
  mutations: {
    updateOntologyIri(state, ontologyIri) {
      state.ontologyIri = ontologyIri
    },
    updateDatamodelIri(state, datamodelIri) {
      state.datamodelIri = datamodelIri
    },
    updateValuesetIri(state, valuesetIri) {
      state.valuesetIri = valuesetIri
    },
    updateConceptAggregate(state, conceptAggregate) {
      state.conceptAggregate = conceptAggregate
    },
  },
  actions: {
    async fetchConceptAggregate({ commit }, iri) {
      const concept = (await ConceptService.getConcept(iri)).data;
      const parents = (await ConceptService.getConceptParentHierarchy(iri)).data;
      const children = (await ConceptService.getConceptChildren(iri)).data;
      commit('updateConceptAggregate', {
        concept: concept,
        parents: parents,
        children: children,
      });

    }
  },
  modules: {}
});
