<template>
  <div>
    <Panel header="Summary" :toggleable="true">
      <div class="p-grid">
        <div class="p-col-4" v-if="concept.name">
          <ScrollPanel style="width: 100%; height: 100px">
            {{ concept.description }}
          </ScrollPanel>
        </div>
        <div class="p-col-4" v-if="concept.name">
          <p><strong>Name:</strong> {{ concept.name }}</p>
          <p><strong>Iri:</strong> {{ concept.iri }}</p>
          <p><strong>Code:</strong> {{ concept.code }}</p>
        </div>
        <div class="p-col-4" v-if="concept.name">
          <p><strong>Status:</strong> {{ concept.status }}</p>
          <p><strong>Scheme:</strong> {{ concept.scheme.name }}</p>
          <p><strong>Type:</strong> {{ concept.conceptType }}</p>
        </div>
      </div>
    </Panel>

    <Panel header="Defintion" :toggleable="true" v-if="$route.name == 'Ontology'">
      {{ concept }}
    </Panel>

    <Panel header="Properties" :toggleable="true" v-if="$route.name == 'Datamodel'">
      <DataTable :value="properties" class="p-datatable-sm">
        <!-- <template #header>
          Properties
        </template> -->
        <Column field="name" header="Name"></Column>
        <Column field="iri" header="Iri"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="cardinality" header="Cardinality"></Column>
      </DataTable>
    </Panel>

    <Panel header="Inheritance" :toggleable="true" v-if="$route.name == 'Datamodel'">
      <OrganizationChart :value="inheritance">
        <template #default="slotProps">
          <span>{{ slotProps.node.data.label }}</span>
        </template>
      </OrganizationChart>
    </Panel>

    <Panel header="Members" :toggleable="true" v-if="$route.name == 'Valueset'">
      {{ concept }}
    </Panel>

    <Panel header="Editor" :toggleable="true">
      <Editor />
    </Panel>



    <div class="p-grid">
      <div class="p-col-4">
        <Panel header="Mapped from" :toggleable="true"><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name"></Listbox></Panel>
      </div>
      <div class="p-col-4">
        <Panel header="Mapped to" :toggleable="true"><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name"></Listbox></Panel>
      </div>
      <div class="p-col-4">
        <Panel header="Used In" :toggleable="true"><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name"></Listbox></Panel>
      </div>
    </div>

    <!-- <Panel header="Mapped from/to and Used In" :toggleable="true">
      <div class="p-grid">
        <div class="p-col-4"><p><Strong>Mapped from:</Strong></p><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name"></Listbox></div>
        <div class="p-col-4"><p><Strong>Mapped to:</Strong></p><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name" /></div>
        <div class="p-col-4"><p><Strong>Used in:</Strong></p><Listbox v-model="selectedConcept" :options="concepts" optionLabel="name" /></div>
      </div>
    </Panel> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConceptService from '../services/ConceptService';
import Editor from '../components/Editor.vue';

@Options({
  components: {Editor},
  prop: {},
})
export default class ConceptDisplay extends Vue {
  private conceptService = new ConceptService();
  concept: any = {};
  selectedConcept = null;
  concepts = [
    { name: 'Encounter (record type) | :Encounter', code: 'Encounter' },
    { name: 'Encounter (type) | :1741000252102', code: 'Patient' },
    { name: 'Appointment (slot)  (record type) | :Appointment', code: 'Appointment' },
    { name: 'Patient (record type) | :Patient', code: 'Patient' },
    { name: 'Team  (record type) | :Team', code: 'Team' },
  ];

  properties = [
    { name: 'Encounter (record type)', iri: ':Encounter', type: 'Concept class', cardinality: '	1 : *' },
    { name: 'Encounter (type)', iri: ':Patient', type: 'Concept class', cardinality: '	1 : *' },
    { name: 'Appointment (slot)  (record type)', iri: ':Appointment', type: 'Concept class', cardinality: '	1 : *' },
    { name: 'Patient (record type)', iri: ':Patient', type: 'Concept class', cardinality: '	1 : *' },
    { name: 'Team  (record type)', iri: ':Team', type: 'Concept class', cardinality: '	1 : *' },
  ];

   inheritance = {
    key: '0',
    data: { label: 'Health record' },
    children: [
      {
        key: '0_0',
        data: { label: 'Child Concept 1' },
        children: [],
      },
      {
        key: '0_1',
        data: { label: 'Child Concept 2' },
        children: [],
      },
      {
        key: '0_2',
        data: { label: 'Child Concept 3' },
        children: [],
      },
      {
        key: '0_3',
        data: { label: 'Child Concept 4' },
        children: [],
      },
    ],
  };

  async mounted() {
    const conceptIri: any = this.$router.currentRoute.value.params.conceptIri;
    this.concept = await (await this.conceptService.getConcept(conceptIri)).data;
  }
}
</script>
