import { Concept } from './../../models/objectmodel/Concept';
import { DiscoverySyntaxLexer } from './../../discovery-syntax/DiscoverySyntaxLexer';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import TodoLangErrorListener, {
  ITodoLangError,
} from './../../discovery-syntax/DiscoveryErrorListener';
import {
  ConceptContext,
  DiscoverySyntaxParser,
} from './../../discovery-syntax/DiscoverySyntaxParser';
import { DiscoveryLanguageId } from './../../discovery-syntax/DiscoveryLanguage';
import { NgEventBus } from 'ng-event-bus';
import { LoggerService } from 'src/app/services/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Perspectives } from 'src/app/services/perspective.service';
import { ConceptService } from 'src/app/services/concept.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ConceptStatus } from 'src/app/models/objectmodel/ConceptStatus';

@Component({
  selector: 'app-edit-concept',
  templateUrl: './edit-concept.component.html',
  styleUrls: ['./edit-concept.component.scss'],
})
export class EditConceptComponent implements OnInit {
  @Input() tab: boolean;
  @Input() concept: Concept;
  conceptForm: Concept;
  conceptText: string;
  error: any;
  definitionText: string;
  definitionChanged: Subject<string> = new Subject<string>();
  dialogRef: MatDialogRef<EditConceptComponent>;

  schemes: any[];
  conceptTypes: any[];


  get isValidSyntax(): boolean {
    let validation;
    try {
      validation = this.parse(this.definitionText);
      return !!this.definitionText && !validation.errors.length;
    } catch (error) {
      return false;
    }
  }

  get isValidForm(): boolean {
    return true;
  }

  statuses = [
    { value: 'Draft'},
    { value: 'Active'},
    { value: 'Inactive'}
  ];
  editorOptions = {
    theme: 'vs-dark',
    language: 'DiscoverySyntax',
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 80,
  };
  editorOptions2 = {
    theme: 'vs-dark',
    language: 'json',
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 80,
  };

  constructor(
    private service: ConceptService,
    public perspectives: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus
  ) {
    this.definitionChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe(
        (evnt) => this.validate(evnt),
        (error) => (error) => this.log.error(error)
      );
  }

  ngOnInit() {
    this.conceptForm = JSON.parse(JSON.stringify(this.concept));
  }

  ngOnChanges(): void {
    // Edit Concept
    this.conceptText = JSON.stringify(this.concept, null, '\t');
    this.service.getConceptImLang(this.concept.iri).subscribe(
      (result) => (this.definitionText = result),
      (error) => this.log.error(error)
    );
  }

  validate(evnt) {
    const ret = this.parse(evnt);

    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(
      model,
      DiscoveryLanguageId,
      ret.errors.map((e) => this.toDiagnostics(e))
    );
  }

  parse(code: string): { ast: ConceptContext; errors: ITodoLangError[] } {
    const inputStream = new ANTLRInputStream(code);
    const lexer = new DiscoverySyntaxLexer(inputStream);
    lexer.removeErrorListeners();
    const todoLangErrorListener = new TodoLangErrorListener();
    lexer.addErrorListener(todoLangErrorListener);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DiscoverySyntaxParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorListener);
    const ast = parser.concept();
    const errors: ITodoLangError[] = todoLangErrorListener.getErrors();
    return { ast, errors };
  }

  toDiagnostics(error: ITodoLangError): monaco.editor.IMarkerData {
    return {
      ...error,
      severity: monaco.MarkerSeverity.Error,
    };
  }

  onClick() {
    const create = this.service.createConcept(this.definitionText);
    create.subscribe(
      (ok) => {
        this.conceptText = JSON.stringify(ok, null, '\t');
        this.log.success('Concept created successfully.');
        // document.getElementById('cancel').click();
      },
      (error) => (this.error = error)
    );
  }

  onSend() {
    // const create = this.service.createConcept(this.definitionText);
    // create.subscribe(
    //   (ok) => {
    //     this.conceptText = JSON.stringify(ok, null, '\t');
    //     this.log.success('Concept created successfully.');
    //     // document.getElementById('cancel').click();
    //   },
    //   (error) => (this.error = error)
    // );
    console.log(this.concept.status);
    console.log(this.conceptForm.iri);
    console.log(this.conceptForm.status);
  }
}
