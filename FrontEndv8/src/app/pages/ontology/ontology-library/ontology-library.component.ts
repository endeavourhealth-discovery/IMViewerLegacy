import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { Perspective } from 'src/app/models/Perspective';
import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { ConceptService, ConceptAggregate } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { NgEventBus } from 'ng-event-bus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';
import { Perspectives } from '../../../services/perspective.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { DiscoverySyntaxLexer } from '../../../discovery-syntax/DiscoverySyntaxLexer';
import { DefinitionContext, DiscoverySyntaxParser } from '../../../discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, { ITodoLangError } from '../../../discovery-syntax/DiscoveryErrorListener';
import { DiscoveryLanguageId } from '../../../discovery-syntax/DiscoveryLanguage';
import { ConceptView, HistoryItem } from '../../../common/ConceptView';

@Component({
  selector: 'app-ontology-library',
  templateUrl: './ontology-library.component.html',
  styleUrls: ['./ontology-library.component.scss']
})
export class OntologyLibraryComponent implements OnInit {
  concept: Concept;
  conceptText: string;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  perspective: Perspective;
  //selectedIri: string;
  relationships = ['sn:116680003'];

  history = [];
  timer: any;
  sidebar = false;
  editorOptions = {
    theme: 'vs-dark', language: 'DiscoverySyntax',
    wordWrap: 'wordWrapColumn', wordWrapColumn: 80
  };
  editorOptions2 = {
    theme: 'vs-dark', language: 'json',
    wordWrap: 'wordWrapColumn', wordWrapColumn: 80
  };
  parseError = null;

  conceptView: ConceptView;

  constructor(private service: ConceptService,
    public perspectives: Perspectives,
    private perspectiveService: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus) {
    //this.routeEvent(this.router);
    this.conceptView = new ConceptView(service, perspectives, log, router, route, perspectives.ontology);
    this.conceptView.onNavigationStart(this.onConceptAggregateChange.bind(this), this.onError.bind(this))
    this.conceptView.onNavigationEnd(this.onHistoryChange.bind(this), this.onError.bind(this))
  }

  ngOnInit() {
    this.conceptView.init();
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if (conceptAggregate != null) {
      console.log("SemanticOntologyView.onConceptAggregateChange  conceptAggregate", JSON.stringify(conceptAggregate));
      this.concept = conceptAggregate.concept;
      this.children = conceptAggregate.children;
      this.parents = conceptAggregate.parents;
      this.perspective = this.perspectiveService.getPerspectiveByConceptType(this.concept.conceptType);
/*
      this.perspectiveService.getPerspective(this.selectedIri).subscribe(
        (result) => this.perspective = result,
        (error) => this.log.error(error)
      );
*/
    }
    else {
      this.log.debug("onConceptAggregateChange - ConceptAggregate is null");
    }
  }

  private onHistoryChange(history: Array<HistoryItem>): void {
    this.history = history;
  }

  private onError(error: any): void {
    this.log.error(error);
  }
}
