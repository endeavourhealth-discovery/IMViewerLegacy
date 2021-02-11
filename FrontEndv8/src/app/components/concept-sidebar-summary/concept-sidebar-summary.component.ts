import { Perspectives } from 'src/app/services/perspective.service';
import { Perspective } from './../../models/Perspective';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Concept} from '../../models/objectmodel/Concept';
import { ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import { NgEventBus} from 'ng-event-bus';
import { ConceptService} from '../../services/concept.service';
import { LoggerService} from '../../services/logger.service';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';

@Component({
  selector: 'app-concept-sidebar-summary',
  templateUrl: './concept-sidebar-summary.component.html',
  styleUrls: ['./concept-sidebar-summary.component.scss']
})
export class ConceptSidebarSummaryComponent implements OnInit {
  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;
  @Input() relationships: string[];
  @Input() selectedIri: string;
  @Input() perspective: Perspective;
  sidebar = false;
  usages: Array<ConceptReference>;
  summaryConcept: Concept = new Concept();
  summaryPerspective: Perspective;
  timer: any;
  enabled = true;

  constructor(
    private service: ConceptService,
    private perspectiveService: Perspectives,
    private log: LoggerService,
    private eventBus: NgEventBus
  ) {
    this.eventBus.on('app:conceptSummary').subscribe((iri: string) => {
      this.activateSummary(iri);
    });
  }

  ngOnInit() {
    this.summaryConcept = this.concept;
    this.summaryPerspective = this.perspective;
    this.getExtras();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("testChanges");
    // this.activateSummary(this.concept.iri);
  }

  getExtras() {
    const root = this;
    if (this.concept != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);

      this.summaryPerspective = this.perspectiveService.getPerspectiveByConceptType(this.concept.conceptType);

      this.service.findUsages(this.concept.iri).subscribe(
        (result) => this.usages = result,
        (error) => this.log.error(error)
      );

      this.reloadTree();

    } else {
      clearTimeout(this.timer);
    }
  }



  activateSummary(iri: string) {
    const root = this;
    if (iri != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);

      this.service.getConcept(iri).subscribe(
        (result) => {
          this.summaryConcept = result;
          this.summaryPerspective = this.perspectiveService.getPerspectiveByConceptType(result.conceptType);
        },
        (error) => this.log.error(error)
      );

      this.service.getConceptParents(iri).subscribe(
        (result) => this.parents = result,
        (error) => this.log.error(error)
      );

      this.service.getConceptChildren(iri).subscribe(
        (result) => this.children = result,
        (error) => this.log.error(error)
      );

      this.reloadTree();

    } else {
      clearTimeout(this.timer);
    }
  }

  reloadTree(){
    this.enabled = false;
    const self = this;
    setTimeout(function(){
      self.enabled = true;
    }, 1);
  }

  selectNode(iri: string):void {
    this.eventBus.cast('app:conceptSelect', iri);
  }

}
