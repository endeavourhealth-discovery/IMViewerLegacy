import { Concept } from './../../models/objectmodel/Concept';
import { DiscoverySyntaxLexer } from './../../discovery-syntax/DiscoverySyntaxLexer';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import TodoLangErrorListener, { ITodoLangError } from './../../discovery-syntax/DiscoveryErrorListener';
import { ConceptContext, DiscoverySyntaxParser } from './../../discovery-syntax/DiscoverySyntaxParser';
import { DiscoveryLanguageId } from './../../discovery-syntax/DiscoveryLanguage';
import { NgEventBus } from 'ng-event-bus';
import { LoggerService } from 'src/app/services/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Perspectives } from 'src/app/services/perspective.service';
import { ConceptService } from 'src/app/services/concept.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-edit-concept',
  templateUrl: './edit-concept.component.html',
  styleUrls: ['./edit-concept.component.scss']
})
export class EditConceptComponent implements OnInit {

  @Input() concept: Concept;
  conceptText: string;
  definitionText = 'SubClassOf (":VSET_Covid0" AND PROPERTY(":hasMembers" = some ("sn:1240521000000100" AND "sn:1240531000000103")))';
  definitionChanged: Subject<string> = new Subject<string>();
  editorOptions = {theme: 'vs-dark', language: 'DiscoverySyntax',
  wordWrap: 'wordWrapColumn',	wordWrapColumn: 80};
  editorOptions2 = {theme: 'vs-dark', language: 'json',
  wordWrap: 'wordWrapColumn',	wordWrapColumn: 80};


  constructor(private service: ConceptService,
    public perspectives: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus) {
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

  ngOnInit() {
  }

  ngOnChanges(): void {
    // Edit Concept
    this.conceptText = JSON.stringify(this.concept, null, '\t');
    this.service.getConceptImLang(this.concept.iri).subscribe(
      (result) => this.definitionText = result,
      (error) => this.log.error(error)
    );

  }

  validate(evnt) {
    let ret = this.parse(evnt);

    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(model, DiscoveryLanguageId, ret.errors.map(e => this.toDiagnostics(e)))
  }

  parse(code: string): { ast: ConceptContext, errors: ITodoLangError[] } {
    const inputStream = new ANTLRInputStream(code);
    const lexer = new DiscoverySyntaxLexer(inputStream);
    lexer.removeErrorListeners()
    const todoLangErrorsListner = new TodoLangErrorListener();
    lexer.addErrorListener(todoLangErrorsListner);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DiscoverySyntaxParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorsListner);
    const ast = parser.concept();
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
