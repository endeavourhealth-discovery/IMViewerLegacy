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
  timer: any;

  constructor(
    private service: ConceptService,
    private perspectiveService: Perspectives,
    private log: LoggerService,
    private eventBus: NgEventBus
  ) {
  }

  ngOnInit() {
    this.updatePerspective(this.concept.iri);
  }

  updatePerspective(iri: string) {
      this.perspectiveService.getPerspective(iri).subscribe(
        (result) => this.perspective = result,
        (error) => this.log.error(error)
      );
  }

  getSize() {
    if(this.perspective.root == ':DiscoveryCommonDataModel') {
      return 50;
    } else {
      return 75;
    }
  }
}
