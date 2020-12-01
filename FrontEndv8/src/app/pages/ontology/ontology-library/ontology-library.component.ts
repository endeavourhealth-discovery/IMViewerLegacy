import { ConceptReferenceNode } from './../../../models/objectmodel/ConceptReferenceNode';
import { ConceptTreeViewComponent } from 'im-common/im-controls';
import { ConceptService } from './../../../services/concept.service';
import { Concept } from './../../../models/objectmodel/Concept';
import { NgEventBus } from 'ng-event-bus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { LoggerService } from 'dds-angular8/logger';
import { JsonEditorOptions } from 'ang-jsoneditor';
import {AppConfig} from '../../../app-config.service';

@Component({
  selector: 'app-ontology-library',
  templateUrl: './ontology-library.component.html',
  styleUrls: ['./ontology-library.component.scss']
})
export class OntologyLibraryComponent implements OnInit {
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  selectedIri: string;
  searchSize = 72;
  root = ':SemanticConcept';
  relationships = ['sn:116680003'];
  hoveredConcept: Concept = new Concept();
  definition = null;
  conceptPropertyObjects = [];

  history = [];
  timer: any;
  sidebar = false;
  editorOptions = new JsonEditorOptions();


  @ViewChild(ConceptTreeViewComponent, { static: true }) treeView: ConceptTreeViewComponent;

  constructor(private service: ConceptService,
    private appConfig: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus) {
    this.routeEvent(this.router);
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
    this.editorOptions.expandAll = true;

    this.eventBus.on('app:conceptHover').subscribe((iri: string) => {
      this.itemHover(iri);
    });
  }

  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd && this.concept !== undefined) {
        this.history.unshift(
          {
            url: e.url,
            concept: this.concept
          }
        );
      }
    });
  }

  ngOnInit() {
    this.appConfig.subtitle = 'Semantic Ontology';
    // Direct URL nav - need to push to tree
    this.route.queryParamMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );
  }

  getData(event) {
    console.log(event);
  }

  displayConcept(iri: string) {
    if (this.selectedIri !== iri) {
      this.selectedIri = iri;
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );
      this.service.getConceptChildren(iri).subscribe(
        (result) => this.children = result,
        (error) => { this.log.error(error); }
      );

      this.service.getConceptParents(iri).subscribe(
        (result) => this.parents = result,
        (error) => { this.log.error(error); }
      );
    }
  }

  itemHover(iri: string) {
    const root = this;
    if (iri != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);
      this.service.getConcept(iri).subscribe(
        (result) => this.hoveredConcept = result,
        (error) => this.log.error(error)
      );
    } else {
      clearTimeout(this.timer);
    }
  }

  json(object: any): string {
    return JSON.stringify(object);
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['ontology'], { queryParams: { id: iri } });
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }
}
