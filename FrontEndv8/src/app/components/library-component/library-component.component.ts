import {Component, Input, OnInit} from '@angular/core';
import {Concept} from '../../models/objectmodel/Concept';
import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import {NgEventBus} from 'ng-event-bus';
import {ConceptService} from '../../services/concept.service';
import {LoggerService} from '../../services/logger.service';
import {Perspective} from '../../models/Perspective';

@Component({
  selector: 'app-library-component',
  templateUrl: './library-component.component.html',
  styleUrls: ['./library-component.component.scss']
})
export class LibraryComponentComponent implements OnInit {
  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;
  @Input() relationships: string[];
  @Input() selectedIri: string;
  @Input() perspective: Perspective;
  sidebar = false;
  hoveredConcept: Concept = new Concept();
  timer: any;

  constructor(
    private service: ConceptService,
    private log: LoggerService,
    private eventBus: NgEventBus
  ) {
    this.eventBus.on('app:conceptSummary').subscribe((iri: string) => {
      this.activateSummary(iri);
    });
  }

  ngOnInit() {
  }

  activateSummary(iri: string) {
    const root = this;
    if (iri != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);
      this.service.getConcept(iri).subscribe(
        (result) => this.hoveredConcept = result,
        (error) => this.log.error(error)
      );
    } else {
      clearTimeout(this.timer);
    }
  }
}
