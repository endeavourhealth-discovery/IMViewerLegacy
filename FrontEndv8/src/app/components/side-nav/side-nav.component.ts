import { Concept } from './../../models/Concept';
import { LoggerService } from 'dds-angular8';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ConceptService } from './../../concept.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() concept: Concept;
  @Input() root: string;
  @Input() relationships: string;
  @Input() selectedIri: string;
  @Output() itemHoverEvent: EventEmitter<any> = new EventEmitter<any>();
  searchSize = 72;
  history = [];


  constructor(
              private router: Router) {
      this.routeEvent(this.router);
    }

  ngOnInit() {
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

  itemHover(concept: Concept) {
    this.itemHoverEvent.emit(concept);
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['ontology'], {queryParams: {id: iri}});
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

}
