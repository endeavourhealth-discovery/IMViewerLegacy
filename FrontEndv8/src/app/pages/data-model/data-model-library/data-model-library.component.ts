import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptService, ConceptAggregate } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataModelTabularViewComponent } from '../../../components/data-model-tabular-view/data-model-tabular-view.component';
import { NgEventBus } from 'ng-event-bus';
import { LoggerService } from '../../../services/logger.service';
import { Perspectives } from '../../../services/perspective.service';
import { SummaryDrawerComponent } from '../../../components/summary-drawer/summary-drawer.component';
import { ConceptView, HistoryItem } from '../../../common/ConceptView';

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss'],
})
class DataModelLibraryComponent implements OnInit {

  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  relationships = ['sn:116680003']; // this can move to the perspective
  hoveredConcept: Concept = new Concept(); // can this be moved into concept view to make it side-bar aware?
  conceptView: ConceptView;
  history = [];

  @ViewChild(DataModelTabularViewComponent, { static: true }) tableView: DataModelTabularViewComponent;
  @ViewChild(SummaryDrawerComponent, { static: true }) summaryDrawer: SummaryDrawerComponent;

  constructor(private service: ConceptService,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private eventBus: NgEventBus) {
    this.conceptView = new ConceptView(service, perspectives, log, router, route, perspectives.dataModel);
    this.conceptView.onNavigationStart(this.onConceptAggregateChange.bind(this), this.onError.bind(this) )
    this.conceptView.onNavigationEnd(this.onHistoryChange.bind(this), this.onError.bind(this) )

    this.eventBus.on('app:conceptSummary').subscribe((iri: string) => {
      this.showSummaryDrawer(iri);
    });
  }

  ngOnInit() {
    this.conceptView.init();
  }

  get selectedIri() {
    return this.concept.iri;
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if(conceptAggregate != null) {
      console.log("DataModelView.onConceptAggregateChange  conceptAggregate", JSON.stringify(conceptAggregate));

      this.concept = conceptAggregate.concept;
      this.children = conceptAggregate.children;
      this.parents = conceptAggregate.parents;
    }
    else {
      this.log.debug("onConceptAggregateChange - ConceptAggregate is null");
    }
  }

  private onHistoryChange(history: Array<HistoryItem>): void {
    this.history = history;
  }

  private onError(error: any): void {
    this.log.error(error);
  }

  showSummaryDrawer(iri: string) {
    const root = this;
    if (iri != null) {
      this.service.getConcept(iri).subscribe(
        (hoveredConcept) => {
          this.hoveredConcept = hoveredConcept,
          this.summaryDrawer.open();
        },
        (error) => this.onError(error)
      );
    }
  }
}

export {
  DataModelLibraryComponent
}
