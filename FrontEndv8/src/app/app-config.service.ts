import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig  {
  constructor() {
  }

  subtitle = null;

  ontology = {
    "caption": "Semantic Ontology",
    "subtitle": "Complete conceptual definitions",
    "description": "The semantic ontology is the set of concepts used in all parts of the information model, from clinical concepts through to data structure concepts",
    "primary": {state: "ontology", name: "Explore"},
    "image": "concepts.jpg",
    "icon": "fa-lightbulb",
    "color": "orange"
  };

  dataModel = {
    "caption": "Data Models",
    "subtitle": "Data model definition explorer",
    "description": "The data model is a set of entities, attributes and value sets, all of which are defined precisely in the ontology, but he data model, being created for a specific business of healthcare is separate to the ontology",
    "primary": {state: "dataModel", name: "Explore"},
    "additionalStates": [
      {state: "dataModelOverview", name: "Overview"}
    ],
    "image": "hexes.jpg",
    "icon": "fa-sitemap",
    "color": "green"
  };

  valueSets = {
    "caption": "Value Sets",
    "subtitle": "Value set and member explorer",
    "description": "Business purpose specific collections of concepts from the ontology used in the data model or in query and contain concepts as defined in the ontology, using the ontology language, including advanced concept classes",
    "primary": {state: "valueSets", name: "Explore"},
    "image": "circles.jpg",
    "icon": "fa-tasks",
    "color": "brown"
  };

  dataSets = {
    "caption": "Data Sets",
    "subtitle": "Data set definition explorer",
    "description": "Data set definitions apply rules and filters to a data model in order to specify the nature of the entries and their content required in a purpose specific data set.",
    "primary": {state: "dataSets", name: "Explore"},
    "image": "nodes.jpg",
    "icon": "fa-chart-network",
    "color": "purple"
  };

  maps = {
    "caption": "Maps",
    "subtitle": "Data model maps",
    "description": "Data model maps specify how data is transformed from a data model to a particular database.",
    "primary": {state: "dataMaps", name: "Explore"},
    "image": "maps.jpg",
    "icon": "fa-tasks",
    "color": "blue"
  };

  perspectives: any[] = [
    this.ontology,
    this.dataModel,
    this.valueSets,
    this.dataSets,
    this.maps,
  ];
}
