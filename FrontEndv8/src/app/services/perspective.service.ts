import {Injectable} from '@angular/core';
import {Perspective} from '../models/Perspective';

@Injectable()
export class Perspectives  {
  constructor() {
  }

  current: Perspective;

  ontology: Perspective = {
    "caption": "Semantic Ontology",
    "subtitle": "Complete conceptual definitions",
    "description": "The semantic ontology is the set of concepts used in all parts of the information model, from clinical concepts through to data structure concepts",
    "primary": {state: "ontology", name: "Explore"},
    "image": "concepts.jpg",
    "icon": "fa-lightbulb",
    "color": "orange",
    "root": ":SemanticConcept"
  };

  dataModel: Perspective = {
    "caption": "Data Models",
    "subtitle": "Data model definition explorer",
    "description": "The data model is a set of entities, attributes and value sets, all of which are defined precisely in the ontology, but he data model, being created for a specific business of healthcare is separate to the ontology",
    "primary": {state: "dataModel", name: "Explore"},
    "additionalStates": [
      {state: "dataModelOverview", name: "Overview"}
    ],
    "image": "hexes.jpg",
    "icon": "fa-sitemap",
    "color": "green",
    "root": ":DiscoveryCommonDataModel"
  };

  valueSets: Perspective = {
    "caption": "Value Sets",
    "subtitle": "Value set and member explorer",
    "description": "Business purpose specific collections of concepts from the ontology used in the data model or in query and contain concepts as defined in the ontology, using the ontology language, including advanced concept classes",
    "primary": {state: "valueSets", name: "Explore"},
    "image": "circles.jpg",
    "icon": "fa-tasks",
    "color": "brown",
    "root": ":VSET_ValueSet"
  };

  dataSets: Perspective = {
    "caption": "Data Sets",
    "subtitle": "Data set definition explorer",
    "description": "Data set definitions apply rules and filters to a data model in order to specify the nature of the entries and their content required in a purpose specific data set.",
    "primary": {state: "dataSets", name: "Explore"},
    "image": "nodes.jpg",
    "icon": "fa-chart-network",
    "color": "purple",
    "root": ":DSET_DataSet"
  };

  maps: Perspective = {
    "caption": "Maps",
    "subtitle": "Data model maps",
    "description": "Data model maps specify how data is transformed from a data model to a particular database.",
    "primary": {state: "dataMaps", name: "Explore"},
    "image": "maps.jpg",
    "icon": "fa-map-signs",
    "color": "blue",
    "root": "MAP_Map"
  };

  perspectives: Perspective[] = [
    this.ontology,
    this.dataModel,
    this.valueSets,
    this.dataSets,
    this.maps,
  ];
}
