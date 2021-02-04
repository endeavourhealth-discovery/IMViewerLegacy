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
  mappedFrom: Array<ConceptReference>;
  mappedTo: Array<ConceptReference>;
  perspective: Perspective;
  //selectedIri: string;
  hoveredConcept: Concept = new Concept();
  definition = null;
  definitionText = 'SubClassOf (":VSET_Covid0" AND PROPERTY(":hasMembers" = some ("sn:1240521000000100" AND "sn:1240531000000103")))';
  definitionChanged: Subject<string> = new Subject<string>();
  conceptPropertyObjects = [];
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

    this.eventBus.on('app:conceptSummary').subscribe((iri: string) => {
      this.activateSummary(iri);
    });

    this.definitionChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe(
        (evnt) => this.validate(evnt),
        error => (error) => this.log.error(error)
      );

    console.log('test');
  }

  ngOnInit() {
    this.conceptView.init();
  }

  get selectedIri() {
    return this.concept.iri;
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if (conceptAggregate != null) {
      console.log("SemanticOntologyView.onConceptAggregateChange  conceptAggregate", JSON.stringify(conceptAggregate));

      this.concept = conceptAggregate.concept;
      this.children = conceptAggregate.children;
      this.parents = conceptAggregate.parents;

      this.conceptText = JSON.stringify(this.concept, null, '\t');
      this.service.getConceptImLang(this.concept.iri).subscribe(
        (result) => this.definitionText = result,
        (error) => this.log.error(error)
      );
      this.perspectiveService.getPerspective(this.selectedIri).subscribe(
        (result) => this.perspective = result,
        (error) => this.log.error(error)
      );

      this.service.findMappedFrom(this.selectedIri).subscribe(
        (result) => this.mappedFrom = result,
        (error) => this.log.error(error)
      );

      this.service.findMappedTo(this.selectedIri).subscribe(
        (result) => this.mappedTo = result,
        (error) => this.log.error(error)
      );
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

  selectNode(iri: string):void {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  activateSummary(iri: string) {
    if (iri != null) {
      this.service.getConcept(iri).subscribe(
        (hoveredConcept) => {
          this.hoveredConcept = hoveredConcept
        },
        (error) => this.log.error(error)
      );
    }
  }

  validate(evnt) {
    let ret = this.parse(evnt);

    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(model, DiscoveryLanguageId, ret.errors.map(e => this.toDiagnostics(e)))
  }

  parse(code: string): { ast: DefinitionContext, errors: ITodoLangError[] } {
    const inputStream = new ANTLRInputStream(code);
    const lexer = new DiscoverySyntaxLexer(inputStream);
    lexer.removeErrorListeners()
    const todoLangErrorsListner = new TodoLangErrorListener();
    lexer.addErrorListener(todoLangErrorsListner);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DiscoverySyntaxParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorsListner);
    const ast = parser.definition();
    const errors: ITodoLangError[] = todoLangErrorsListner.getErrors();
    return { ast, errors };
  }

  toDiagnostics(error: ITodoLangError): monaco.editor.IMarkerData {
    return {
      ...error,
      severity: monaco.MarkerSeverity.Error,
    };
  }
}
