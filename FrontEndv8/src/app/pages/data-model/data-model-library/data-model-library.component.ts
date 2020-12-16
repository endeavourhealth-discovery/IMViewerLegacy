import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptService } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataModelTablularViewComponent } from '../../../components/data-model-tabular-view/data-model-tabular-view.component';
import { NgEventBus } from 'ng-event-bus';
import { LoggerService } from '../../../services/logger.service';
import { Perspectives } from '../../../services/perspective.service';
import { SummaryDrawerComponent } from '../../../components/summary-drawer/summary-drawer.component';

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss'],
})
class DataModelLibraryComponent implements OnInit {

  selectedIri: string;
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;

  searchSize = 72;
  root = ':DiscoveryCommonDataModel';
  relationships = ['sn:116680003'];
  selected = 'dataModel';
  showFiller = true;

  hoveredConcept: Concept = new Concept();

  history = [];

  textual = null;

  @ViewChild(DataModelTablularViewComponent, { static: true }) tableView: DataModelTablularViewComponent;
  @ViewChild(SummaryDrawerComponent, { static: true }) summaryDrawer: SummaryDrawerComponent;

  constructor(private service: ConceptService,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              public dialog: MatDialog,
              private eventBus: NgEventBus) {
    this.routeEvent(this.router);

    this.eventBus.on('app:conceptHover').subscribe((iri: string) => {
      this.itemHover(iri);
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

  ngOnInit() {
    this.perspectives.current = this.perspectives.dataModel;
    // Direct URL nav - need to push to tree
    this.route.queryParamMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );


  }

  displayConcept(iri: string) {
    if (this.selectedIri !== iri) {
      this.selectedIri = iri;
      this.textual = null;
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );
      this.service.getConceptChildren(iri).subscribe(
        (result) => this.children = result,
        (error) => { this.log.error(error); }
      );

      this.service.getConceptParents(iri).subscribe(
        (result) => this.parents = result,
        (error) => { this.log.error(error); }
      );
    }
  }

  itemHover(iri: string) {
    const root = this;
    if (iri != null) {
      this.service.getConcept(iri).subscribe(
        (hoveredConcept) => {
          this.hoveredConcept = hoveredConcept,
          this.summaryDrawer.open();
        },
        (error) => this.log.error(error)
      );
    }
  }
}
export {
  DataModelLibraryComponent
}
