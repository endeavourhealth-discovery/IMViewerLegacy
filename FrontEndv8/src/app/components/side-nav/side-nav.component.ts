import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { NgEventBus } from 'ng-event-bus';
import { Concept} from '../../models/objectmodel/Concept';
import { Router, NavigationEnd } from '@angular/router';
import { ConceptService } from '../../services/concept.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;
  @Input() root: string;
  @Input() relationships: string;
  @Input() selectedIri: string;

  @Output() openDialogEvent: EventEmitter<any> = new EventEmitter<any>();

  searchSize = 72;
  history = [];


  constructor(
    private service: ConceptService,
    private router: Router,
    private log: LoggerService,
    private eventBus: NgEventBus) {
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
    this.eventBus.cast('app:conceptHover', concept.iri);
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.eventBus.cast('app:conceptSelect', iri);
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  openDialog() {
    this.openDialogEvent.emit();
  }

}
