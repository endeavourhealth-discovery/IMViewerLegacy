import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { NgEventBus } from 'ng-event-bus';
import { Concept} from '../../models/objectmodel/Concept';
import { Router, NavigationEnd } from '@angular/router';
import { ConceptService } from '../../services/concept.service';
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import { ConceptSearchComponent } from '../concept-search/concept-search.component';
import { MatTabGroup } from '@angular/material/tabs';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { MatTab } from '@angular/material/tabs';
import { Perspective } from 'src/app/models/Perspective';
import { Perspectives } from 'src/app/services/perspective.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;
  @Input() root: string;
  @Input() relationships: string;
  @Input() selectedIri: string;
  @ViewChild('searchComponent', {static: true}) searchComponent: ElementRef;
  @ViewChild('tabs', {static: true}) tabGroup: MatTabGroup;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  history = [];
  searchResults: any[] = [];
  
  private selectedSearchResult: string;

  constructor(
    private service: ConceptService,
    private perpsectiveService: Perspectives,
    private router: Router,
    private log: LoggerService,
    private eventBus: NgEventBus) {
      this.routeEvent(this.router);
      this.eventBus.on(ConceptSearchComponent.MULTIPLE_CONCEPTS_SELECTED_EVENT).subscribe((selectionEvent: ConceptReference[]) => {
        this.showSearchResultsTab(selectionEvent);
      });    
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

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.eventBus.cast('app:conceptSelect', iri);
    }
  }

  openDialog() {
    this.openDialogEvent.emit();
  }

  onSelectSearchResult(iri: string) {
    this.selectedSearchResult = iri;
    this.goto(iri);
  }

  highlightSearchResult(iri: string): boolean {
    return this.selectedSearchResult == iri;
  }

  showSearchResultsTab(searchResults: ConceptReference[]) {
    this.searchResults = [];    

    // now find out what kind of perspective each result belongs to
    searchResults.forEach(searchResult => {
      this.perpsectiveService.getPerspective(searchResult.iri).subscribe(
        (perspective: Perspective) => { 
          this.searchResults.push({concept: searchResult, typeName: perspective.caption, typeColor: perspective.color})
        },
        (error) => {
          this.log.debug(`Warning - unable to find perspective for the concept ${searchResult.iri}`);
          this.searchResults.push({concept: searchResult});
        }
      )
    });

    const searchResultTab: MatTab = this.tabGroup._tabs.find(tab => "Search Results" == tab.textLabel);
    if(searchResultTab != null) {
      this.tabGroup.selectedIndex = searchResultTab.position;
    }
    else {
      // log error
    }
  }
}
