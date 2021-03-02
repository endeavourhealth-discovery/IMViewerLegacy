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
      const conceptService = new ConceptService();
      const concept = await (await conceptService.getConcept(iri)).data;
      const parents = await (await conceptService.getConceptParentHierarchy(iri)).data;
      const children = await (await conceptService.getConceptChildren(iri)).data;
      commit('updateConceptAggregate', {
        concept: concept,
        parents: parents,
        children: children
      });

    }
  },
  modules: {}
});
