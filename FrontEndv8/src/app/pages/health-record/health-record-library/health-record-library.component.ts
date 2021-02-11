import { DiscoveryLanguageId } from './../../../discovery-syntax/DiscoveryLanguage';
import { DiscoverySyntaxLexer } from './../../../discovery-syntax/DiscoverySyntaxLexer';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import TodoLangErrorListener, { ITodoLangError } from './../../../discovery-syntax/DiscoveryErrorListener';
import { DefinitionContext, DiscoverySyntaxParser } from './../../../discovery-syntax/DiscoverySyntaxParser';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptService, ConceptAggregate } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HealthRecordTabularViewComponent } from '../../../components/health-record-tabular-view/health-record-tabular-view.component';
import {Subject} from 'rxjs';
import { NgEventBus } from 'ng-event-bus';
import { LoggerService } from '../../../services/logger.service';
import { Perspectives } from '../../../services/perspective.service';
import { ConceptView, HistoryItem } from '../../../common/ConceptView';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { Perspective } from 'src/app/models/Perspective';

@Component({
  selector: 'app-health-record-library',
  templateUrl: './health-record-library.component.html',
  styleUrls: ['./health-record-library.component.scss'],
})
export class HealthRecordLibraryComponent implements OnInit {

  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  perspective: Perspective;
  relationships = ['sn:116680003']; // this can move to the perspective
  hoveredConcept: Concept = new Concept(); // can this be moved into concept view to make it side-bar aware?
  conceptView: ConceptView;
  history = [];

  // @ViewChild(HealthRecordTabularViewComponent, { static: true }) tableView: HealthRecordTabularViewComponent;

  constructor(private service: ConceptService,
              private perspectiveService: Perspectives,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private eventBus: NgEventBus) {
    this.conceptView = new ConceptView(service, perspectives, log, router, route, perspectives.healthRecord);
    this.conceptView.onNavigationStart(this.onConceptAggregateChange.bind(this), this.onError.bind(this) )
    this.conceptView.onNavigationEnd(this.onHistoryChange.bind(this), this.onError.bind(this) )
  }

  ngOnInit() {
    this.conceptView.init();
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if(conceptAggregate != null) {
      console.log("HealthRecordView.onConceptAggregateChange  conceptAggregate", JSON.stringify(conceptAggregate));
      this.concept = conceptAggregate.concept;
      this.children = conceptAggregate.children;
      this.parents = conceptAggregate.parents;
      this.perspective = this.perspectiveService.getPerspectiveByConceptType(this.concept.conceptType);
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
}
