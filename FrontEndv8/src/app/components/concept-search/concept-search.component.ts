import { NgEventBus } from 'ng-event-bus';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ConceptService} from '../../services/concept.service';
import {LoggerService} from '../../services/logger.service';
import {fromEvent, Subscription} from 'rxjs';
import {ConceptReference} from '../../models/objectmodel/ConceptReference';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-concept-search',
  templateUrl: './concept-search.component.html',
  styleUrls: ['./concept-search.component.scss']
})
export class ConceptSearchComponent implements AfterViewInit {
  static MULTIPLE_CONCEPTS_SELECTED_EVENT: string = "app:ConceptSearchComponent-multipleConcepts-selected";
  
  @ViewChild('searchInput', {static: true}) input: ElementRef;
  @ViewChild(MatAutocompleteTrigger, {static: true}) autocomplete: MatAutocompleteTrigger;

  @Input()  root: string;
  @Input() relationships: string[];

  searchTerm: string;
  searching: boolean;
  searchCall: Subscription = null;
  results: ConceptReference[]


  constructor(private service: ConceptService, private log: LoggerService, private eventBus: NgEventBus) { }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        map((e:any) => e.target.value),
        filter(v => v.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        tap((text) => {
          this.autoComplete(text)
        })
      )
      .subscribe();
  }

  displayFn(concept: ConceptReference): string {
    return concept && concept.name ? concept.name : '';
  }

  autoComplete(term) {
    if (term == null || term == '')
      return;

    if (this.searchCall) {
      this.searchCall.unsubscribe();
      this.searchCall = null;
      this.results = [];
    }
    this.searchCall = this.service.search(term, this.root, this.relationships)
      .subscribe(
        (result) => {
          this.results = result;
          this.searchCall.unsubscribe();
          this.searchCall = null;
        },
        (error) => this.log.error(error)
      );
  }

  clear() {
    this.searchTerm = '';
    this.searching = false;
  }

  selectResult(item: any) {
    this.eventBus.cast('app:conceptSelect', item.iri);
  }

  onMultipleConcepts(searchTerm: string) {
    this.autocomplete.closePanel(); 
    this.eventBus.cast(ConceptSearchComponent.MULTIPLE_CONCEPTS_SELECTED_EVENT, this.results);
  }  
}
