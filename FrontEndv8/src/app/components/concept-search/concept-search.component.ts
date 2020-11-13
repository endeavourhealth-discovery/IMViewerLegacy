import { NgEventBus } from 'ng-event-bus';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoggerService} from 'dds-angular8/logger';
import {ConceptService} from '../../services/concept.service';

@Component({
  selector: 'app-concept-search',
  templateUrl: './concept-search.component.html',
  styleUrls: ['./concept-search.component.scss']
})
export class ConceptSearchComponent implements OnInit {
  @Input()  root: string;
  @Input() relationships: string[];
  @Output() hasResults: EventEmitter<any> = new EventEmitter<any>();

  searchTerm: string;
  searching: boolean;
  searchResults: any[];

  constructor(private service: ConceptService, private log: LoggerService, private eventBus: NgEventBus) { }

  ngOnInit() {
  }

  clear() {
    this.searchTerm = '';
    this.searching = false;
    this.hasResults.emit(false);
  }

  search() {
    this.searchResults = null;
    this.searching = true;
    this.service.search(this.searchTerm, this.root, this.relationships).subscribe(
      (result) => this.showResults(result),
      (error) => {
        this.log.error(error);
        this.searching = false;
      }
    );
  }

  showResults(searchResults: any[]) {
    this.searchResults = searchResults;
    this.searching = false;
    this.hasResults.emit(true);
  }

  selectResult(item: any) {
    this.eventBus.cast('app:conceptSelect', item.iri);
  }
}
