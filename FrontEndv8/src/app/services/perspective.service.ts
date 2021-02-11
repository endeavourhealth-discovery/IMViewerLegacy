import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Perspective} from '../models/Perspective';
import {ConceptService} from './concept.service';
import {LoggerService} from './logger.service';
import {ConceptType} from '../models/objectmodel/ConceptType';

@Injectable()
export class Perspectives  {

  ontology: Perspective = {
    "caption": "Semantic Ontology",
    "subtitle": "Complete conceptual definitions",
    "description": "The semantic ontology is the set of concepts used in all parts of the information model, from clinical concepts through to data structure concepts.",
    "primary": {state: "perspective/ontology", name: "Explore"},
    "image": "ontology.jpg",
    "icon": "fa-lightbulb",
    "color": "orange",
    "root": ":SemanticConcept",
  };

  healthRecord: Perspective = {
    "caption": "Data Models",
    "subtitle": "Data model definition",
    "description": "The data model is a set of entities, attributes and value sets, all of which are defined precisely in the ontology, but the data model, being created for a specific business of healthcare is separate to the ontology.",
    "primary": {state: "perspective/healthRecord", name: "Explore"},
    "additionalStates": [
      {state: "perspective/healthRecordOverview", name: "Overview"}
    ],
    "image": "datamodels.jpg",
    "icon": "fa-sitemap",
    "color": "limegreen",
    "root": ":DiscoveryCommonDataModel"
  };

  valueSets: Perspective = {
    "caption": "Value Sets",
    "subtitle": "Value set and member explorer",
    "description": "Business purpose specific collections of concepts from the ontology used in the data model or in query and contain concepts as defined in the ontology, using the ontology language, including advanced concept classes.",
    "primary": {state: "perspective/valueSets", name: "Explore"},
    "image": "valuesets.jpg",
    "icon": "fa-tasks",
    "color": "brown",
    "root": ":VSET_ValueSet",
  };

  dataSets: Perspective = {
    "caption": "Data Sets",
    "subtitle": "Data set definition explorer",
    "description": "Data set definitions apply rules and filters to a data model in order to specify the nature of the entries and their content required in a purpose specific data set.",
    "primary": {state: "perspective/dataSets", name: "Explore"},
    "image": "datasets.jpg",
    "icon": "fa-chart-network",
    "color": "purple",
    "root": ":DSET_DataSet"
  };

  maps: Perspective = {
    "caption": "Maps",
    "subtitle": "Data model maps",
    "description": "Data model maps specify how data is transformed from a data model to a particular database.",
    "primary": {state: "perspective/dataMaps", name: "Explore"},
    "image": "maps.jpg",
    "icon": "fa-map-signs",
    "color": "DarkTurquoise",
    "root": ":MAP_Map"
  };

  perspectives: Perspective[];
  perspectivesMap: Map<string, Perspective>;

  current: Perspective;

  constructor(private conceptService: ConceptService, private log: LoggerService) {
    this.perspectives = [
      this.ontology,
      this.healthRecord,
      this.valueSets,
      this.dataSets,
      this.maps,
      // this.search,
    ];

    this.perspectivesMap = new Map();
    this.perspectives.forEach(perspective => this.perspectivesMap.set(perspective.root, perspective));
  }

  getPerspective(iri: string): Observable<Perspective> {
    let perspectiveObservable: Subject<Perspective> = new Subject();

    this.conceptService.isOfType(iri, Array.from(this.perspectivesMap.keys())).subscribe(
        (result) => {
            if (result.length == 1) {
                this.log.debug(`Got perspecive ${result[0].iri} for ${iri}`);
                perspectiveObservable.next(this.perspectivesMap.get(result[0].iri));
            }
            else if (result.length > 1) {
                const errorMessage = `warn - found multiple perspectives for concept ${iri}. Falling back on default`;
                this.log.debug(errorMessage);
                perspectiveObservable.error(errorMessage);
            }
            else {
                const errorMessage = `warn - could not find perspective for concept ${iri}. Falling back on default`;
                this.log.debug(errorMessage);
                perspectiveObservable.error(errorMessage);
            }
        },
        (error) => {
            this.log.error(error)
            perspectiveObservable.error("Problem retreiving perspective for concept (iri:" + iri + "). Cause: " + error);
        }
    )

    return perspectiveObservable;
  }

  getAllRootIris(): string[] {
    return this.perspectives.map(perspective => {return perspective.root} );
  }

  getPerspectiveByRoot(rootIri: string): Perspective {
    const perspective: Perspective = this.perspectivesMap.get(rootIri);

    return perspective;
  }

  getPerspectiveByConceptType(conceptType: ConceptType): Perspective {
    switch (conceptType) {
      case ConceptType.ValueSet:
        return this.valueSets;
      case ConceptType.Record:
      case ConceptType.DataProperty:
      case ConceptType.ObjectProperty:
        return this.healthRecord;
      default:
        return this.ontology;
    }
  }
}
