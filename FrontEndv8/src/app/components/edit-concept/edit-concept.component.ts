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
import { ConceptType } from 'src/app/models/objectmodel/ConceptType';
import { CodeSchemes, codeSchemesProvider } from 'src/app/models/search/CodeScheme';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { FormControl, Validators } from '@angular/forms';
import { ConceptDto } from 'src/app/models/objectmodel/ConceptDto';

@Component({
  selector: 'app-edit-concept',
  templateUrl: './edit-concept.component.html',
  styleUrls: ['./edit-concept.component.scss'],
  providers: [ codeSchemesProvider ]
})
export class EditConceptComponent implements OnInit {
  @Input() tab: boolean;
  @Input() concept: Concept;
  conceptDto: ConceptDto;
  conceptText: string;
  error: any;
  definitionText: string;
  definitionChanged: Subject<string> = new Subject<string>();
  dialogRef: MatDialogRef<EditConceptComponent>;
  conceptTypes: string[];
  statuses: string[];
  schemes: ConceptReference[];

  get isValid(): boolean {
    return this.isValidForm && this.isValidSyntax;
  }

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
    const fields = Object.keys(this.validator);

    let noError = true;
    let i = 0;
    while (noError && i < fields.length) {
      if (this.validator[fields[i]].invalid) {
        noError = false;
      }
      i++;
    }
    return noError;
  }

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

  validator = {
    name: new FormControl('', [Validators.required]),
    iri: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    version: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    scheme: new FormControl('', [Validators.required]),
  };

  errorMessage = 'Field is required';

  constructor(
    private service: ConceptService,
    public perspectives: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus,
    private codeSchemes: CodeSchemes
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
    this.codeSchemes.allCodeSchemes.subscribe(allCodeSchemes => {
      this.schemes = allCodeSchemes;
    });
    this.conceptTypes = Object.keys(ConceptType);
    this.statuses = Object.keys(ConceptStatus).filter(f => isNaN(Number(f)));
    this.conceptDto = !!this.concept
      ? JSON.parse(JSON.stringify(this.concept))
      : ConceptDto.getConceptForm();
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
    this.conceptDto.definitionText = this.definitionText;
    console.log(this.conceptDto);
    this.service.createConcept(this.conceptDto).subscribe(
      (ok) => {
        this.conceptText = JSON.stringify(ok, null, '\t');
        this.log.success('Concept created successfully.');
        // document.getElementById('cancel').click();
      },
      (error) => (this.error = error)
    );
  }
}
