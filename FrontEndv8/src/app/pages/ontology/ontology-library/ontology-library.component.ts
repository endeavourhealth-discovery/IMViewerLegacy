import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { ConceptService } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { NgEventBus } from 'ng-event-bus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {LoggerService} from '../../../services/logger.service';
import {Perspectives} from '../../../services/perspective.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts';
import {DiscoverySyntaxLexer} from '../../../discovery-syntax/DiscoverySyntaxLexer';
import {DiscoverySyntaxParser, TodoExpressionsContext} from '../../../discovery-syntax/DiscoverySyntaxParser';
import TodoLangErrorListener, {ITodoLangError} from '../../../discovery-syntax/DiscoveryErrorListener';
import {DiscoveryLanguageId} from '../../../discovery-syntax/DiscoveryLanguage';
import { SummaryDrawerComponent } from '../../../components/summary-drawer/summary-drawer.component';

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
  hoveredConcept: Concept = new Concept();
  definition = null;
  definitionText = '';
  definitionChanged: Subject<string> = new Subject<string>();
  conceptPropertyObjects = [];
  relationships = ['sn:116680003'];

  history = [];
  timer: any;
  sidebar = false;
  editorOptions = {theme: 'vs-dark', language: 'DiscoverySyntax'};
  parseError = null;

  @ViewChild(SummaryDrawerComponent, { static: true }) summaryDrawer: SummaryDrawerComponent;

  constructor(private service: ConceptService,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private eventBus: NgEventBus) {
    this.routeEvent(this.router);

    this.eventBus.on('app:conceptHover').subscribe((iri: string) => {
      this.itemHover(iri);
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
    this.perspectives.current = this.perspectives.ontology;
    // Direct URL nav - need to push to tree
    this.route.paramMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.perspectives.ontology.root),
      (error) => this.log.error(error)
    );
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
    if (iri != null) {
      this.service.getConcept(iri).subscribe(
        (hoveredConcept) => {
          this.hoveredConcept = hoveredConcept,
          this.summaryDrawer.open();
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

  parse(code: string): {ast:TodoExpressionsContext, errors: ITodoLangError[]} {
    const inputStream = new ANTLRInputStream(code);
    const lexer = new DiscoverySyntaxLexer(inputStream);
    lexer.removeErrorListeners()
    const todoLangErrorsListner = new TodoLangErrorListener();
    lexer.addErrorListener(todoLangErrorsListner);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DiscoverySyntaxParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorsListner);
    const ast =  parser.todoExpressions();
    const errors: ITodoLangError[]  = todoLangErrorsListner.getErrors();
    return {ast, errors};
  }

  toDiagnostics(error: ITodoLangError): monaco.editor.IMarkerData {
    return {
      ...error,
      severity: monaco.MarkerSeverity.Error,
    };
  }
}
