import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {Concept} from '../../models/objectmodel/Concept';

@Component({
  selector: 'app-concept-summary',
  templateUrl: './concept-summary.component.html',
  styleUrls: ['./concept-summary.component.scss']
})
export class ConceptSummaryComponent implements OnInit {
  @Input() concept: Concept;

  constructor() { }

  ngOnInit() {
  }

}
