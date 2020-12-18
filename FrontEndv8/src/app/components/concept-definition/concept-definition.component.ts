import {Component, Input, OnInit} from '@angular/core';
import {Concept} from '../../models/objectmodel/Concept';

@Component({
  selector: 'app-concept-definition',
  templateUrl: './concept-definition.component.html',
  styleUrls: ['./concept-definition.component.scss']
})
export class ConceptDefinitionComponent implements OnInit {
  @Input()
  concept: Concept;

  constructor() { }

  ngOnInit() {
  }

}
