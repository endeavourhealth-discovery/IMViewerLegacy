import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { ConceptStatus } from 'src/app/models/objectmodel/ConceptStatus';
import { CodeSchemes, codeSchemesProvider } from 'src/app/models/search/CodeScheme';
import * as searchEvents from 'src/app/models/search/SearchEvents';
import { SearchRequest } from 'src/app/models/search/SearchRequest';
import { SearchResponse } from 'src/app/models/search/SearchResponse';
import { SortBy } from 'src/app/models/search/SortBy';
import { LoggerService } from 'src/app/services/logger.service';
import { Perspectives } from 'src/app/services/perspective.service';

class ConceptSearchOptions {

  codeSchemeSelections: ConceptReference[];
  conceptStatusSelections: string[];
  sortBySelection: string;

  searchRequest: Observable<SearchRequest>
  
  constructor(private _searchRequest: SearchRequest, 
              public conceptStatusOptions: string[],
              public codeSchemeOptions: ConceptReference[],
              public sortByOptions: string[]) {
    this.searchRequest = new Subject();

    this.conceptStatusSelections = _searchRequest.statuses.map(status => { return ConceptStatus[status] } );
    this.codeSchemeSelections = _searchRequest.codeSchemes;
    this.sortBySelection = SortBy[_searchRequest.sortBy]
  }

  // sync string selection in UI to model
  onConceptStatusChange() {
    const selected: ConceptStatus[] = this.conceptStatusSelections.map(selectedName => { return ConceptStatus[selectedName] });
    this._searchRequest.statuses = selected;

    this.onChangeSearchRequest()
  }

  onCodeSchemesChange() {
    this._searchRequest.codeSchemes = this.codeSchemeSelections;

    this.onChangeSearchRequest()
  }

  onSortByChange() {
    const selected: SortBy = SortBy[this.sortBySelection];
    this._searchRequest.sortBy = selected;

    this.onChangeSearchRequest()
  }

  compareCodeSchemes(source: ConceptReference, target: ConceptReference): boolean {
    return source.iri == target.iri;
  }

  get searchTerms() {
    return this._searchRequest.terms;
  }

  get appliedFilterCount() {
    return this.codeSchemeSelections.length + this.conceptStatusSelections.length;
  }

  // filter change
  private onChangeSearchRequest() {
    const searchRequestSubject = this.searchRequest as Subject<SearchRequest>;
    searchRequestSubject.next(this._searchRequest); 
  }
}

@Component({
  selector: 'app-concept-search-result',
  templateUrl: './concept-search-result.component.html',
  styleUrls: ['./concept-search-result.component.scss'],
  providers: [ codeSchemesProvider ]
})
export class ConceptSearchResultComponent implements OnInit  {

  public searchResults: ConceptReference[];
  public searchOptions: ConceptSearchOptions;
  public hasResponse: boolean;

  private selectedSearchResult: string;  

  constructor(private eventBus: NgEventBus, 
              private codeSchemes: CodeSchemes,
              private perpsectiveService: Perspectives, 
              private log: LoggerService) {
    this.eventBus.on(searchEvents.SEARCH_RESULT_EVENT).subscribe((searchResponse: SearchResponse) => {
      this.searchResults = searchResponse.concepts;
      
      this.initSearchOptions(searchResponse.request).subscribe(
        (searchOptions: ConceptSearchOptions) => {
          this.searchOptions = searchOptions;
          this.searchOptions.searchRequest.subscribe(
            (searchRequest => {
              this.eventBus.cast(searchEvents.CONCEPT_SEARCH_FILTER_CHANGE_EVENT, searchRequest);
            })
          )
          this.hasResponse = true;
        },
        (error) => {
          this.log.error(`Error - unable to create search options. Search may not function as user expects. Cause - ${error}.`);
        }
      );
    }); 
    
    this.hasResponse = false;
  }

  ngOnInit(): void {
    // TODO - need a way to check if there's a previous inflight request
    // and if so cancel it and replace with this one
    // this.sortClausesControl.valueChanges.pipe(debounceTime(500)).subscribe(
    //         value => this.setEmailMessage(emailControl)
    // );
  }
 
  get hasResults() {
    return this.hasResponse && this.searchResults.length > 0;
  }

  onSelectSearchResult(conceptReference: ConceptReference) {
    this.selectedSearchResult = conceptReference.iri;
    this.eventBus.cast('app:conceptSelect', conceptReference.iri);
  }

  highlightSearchResult(conceptReference: ConceptReference): boolean {
    return this.selectedSearchResult == conceptReference.iri;
  } 

  private initSearchOptions(searchRequest: SearchRequest): Observable<ConceptSearchOptions> {
    const searchOptionsObservable: Subject<ConceptSearchOptions> = new ReplaySubject();
    
    this.codeSchemes.codeSchemes.subscribe(
      (result) => {
        const conceptStatusOptions: string[] = Object.keys(ConceptStatus).filter(f => isNaN(Number(f)));
        const sortByOptions: string[] = Object.keys(SortBy).filter(f => isNaN(Number(f)));
        searchOptionsObservable.next(new ConceptSearchOptions(searchRequest, conceptStatusOptions, result, sortByOptions));
      },
      (error) => {
        this.log.error(`Error - unable to get a list of code schemes. Cause ${error}`);
      }
    ); 
    
    return searchOptionsObservable;
  }  
}
