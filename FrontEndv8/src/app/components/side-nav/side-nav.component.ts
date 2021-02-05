import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NavigationEnd, Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import * as searchEvents from 'src/app/models/search/SearchEvents';
import { Concept } from '../../models/objectmodel/Concept';
import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { LoggerService } from '../../services/logger.service';

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
  @ViewChild('tabs', {static: true}) tabGroup: MatTabGroup;
  history = [];
  searchResults: any[] = [];

  constructor(
    private router: Router,
    private log: LoggerService,
    private eventBus: NgEventBus) {
      this.routeEvent(this.router);
      this.eventBus.on(searchEvents.SEARCH_RESULT_EVENT).subscribe(searchResponseEvent => {
        this.showSearchResultsTab();
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

  private showSearchResultsTab() {
    const searchResultsTabIndex: number = this.tabGroup._tabs.toArray().findIndex(tab => "Search Results" == tab.textLabel)
    if(searchResultsTabIndex > -1) {
      this.tabGroup.selectedIndex = searchResultsTabIndex;
    }
    else {
      this.log.debug("Warning - unable to automatically move to search results tab");
    }
  }
}
