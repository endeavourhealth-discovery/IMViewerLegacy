import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { ConceptStatus } from 'src/app/models/objectmodel/ConceptStatus';
import { CodeSchemes, codeSchemesProvider } from 'src/app/models/search/CodeScheme';
import * as searchEvents from 'src/app/models/search/SearchEvents';
import { SearchRequest } from 'src/app/models/search/SearchRequest';
import { SearchResponse } from 'src/app/models/search/SearchResponse';
import { SortBy } from 'src/app/models/search/SortBy';
import { Perspectives } from 'src/app/services/perspective.service';
import { ConceptService } from '../../services/concept.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-concept-search',
  templateUrl: './concept-search.component.html',
  styleUrls: ['./concept-search.component.scss'],
  providers: [ codeSchemesProvider ]
})
export class ConceptSearchComponent implements AfterViewInit {
  @ViewChild('conceptSearchInput', {static: true}) conceptSearchInput: ElementRef;

  private searchRequest: Subscription;
  private searchQuery: SearchRequest;

  constructor(private service: ConceptService, private log: LoggerService, private perspectiveService: Perspectives, private codeSchemes: CodeSchemes, private eventBus: NgEventBus) {
    this.searchRequest = null;
    this.searchQuery = this.initSearchQuery();

    this.eventBus.on(searchEvents.CONCEPT_SEARCH_FILTER_CHANGE_EVENT).subscribe((searchQuery: SearchRequest) => {
      this.searchQuery = searchQuery;
      this.search();
    });
  }

  ngAfterViewInit() {
    fromEvent(this.conceptSearchInput.nativeElement,'keyup')
      .pipe(
        map((e:any) => e.target.value),
        filter(v => v.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        tap((text) => {
          this.searchQuery.terms = text;
          this.search();
        })
      )
      .subscribe();
  }
  private search() {
    this.cancelExistingSearch();
    this.doSearch();
  }

  private cancelExistingSearch(): void {
    this.destroySearchRequest(this.searchRequest);
  }

  private destroySearchRequest(searchRequest: Subscription) {
    if (searchRequest) {
      searchRequest.unsubscribe();
      searchRequest = null;
    }
  }

  private doSearch() {
    this.eventBus.cast(searchEvents.SEARCH_RESULT_PENDING_EVENT, this.searchQuery);

    this.searchRequest = this.service.advancedSearch(this.searchQuery)
      .subscribe(
        (searchResponse: SearchResponse) => {
          this.destroySearchRequest(this.searchRequest);
          searchResponse.request = this.searchQuery;
          this.broadcastSearchResults(searchResponse);
        },
        (error) => {
          this.log.error(error);
          this.eventBus.cast(searchEvents.SEARCH_REQUEST_FAILED_EVENT, this.searchQuery);
        }
      );
  }

  private broadcastSearchResults(searchResponse: SearchResponse) {
    this.eventBus.cast(searchEvents.SEARCH_RESULT_EVENT, searchResponse);
  }

  private initSearchQuery(): SearchRequest {
    let searchRequest: SearchRequest = new SearchRequest();

    this.codeSchemes.defaultCodeSchemes.subscribe(defaultCodeSchemes => {
      searchRequest.codeSchemes = defaultCodeSchemes;
    });

    // we want know which (if any) of these types our search results inherit from
    searchRequest.types = this.perspectiveService.getAllRootIris();

    searchRequest.statuses = [ConceptStatus.Active, ConceptStatus.Draft];

    searchRequest.sortBy = SortBy.Usage;

    searchRequest.page = 1;
    searchRequest.size = 25;

    return searchRequest;
  }
}
