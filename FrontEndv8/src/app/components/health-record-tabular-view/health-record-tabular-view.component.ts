import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { Concept } from '../../models/objectmodel/Concept';
import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { ConceptService } from '../../services/concept.service';
import { LoggerService } from '../../services/logger.service';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'health-record-tabular-view',
  templateUrl: './health-record-tabular-view.component.html',
  styleUrls: ['./health-record-tabular-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

class HealthRecordTabularViewComponent {
  static DEFAULT_MIN_CARDINALITY: number = 0;
  static DEFAULT_MAX_CARDINALITY: string = "*";

  propertiesTableData: any[] = [];
  propertiesTableColumns: string[];

  ancestors: Concept[] = [];
  ancestorsTableDataList: any[][] = [];

  parentsChipListTemplateContext: ChipListTemplateContext;
  childrenChipListTemplateContext: ChipListTemplateContext;

  @Input()
  set parents(parents: Array<ConceptReferenceNode>) {
    this.refreshParents(parents);
  }

  @Input()
  set children(children: Array<ConceptReferenceNode>) {
    this.refreshChildren(children);
  }

  @Input()
  set concept(concept: Concept) {
    this.refreshDefinition(concept);
  }

  constructor(private service: ConceptService, private log: LoggerService, private router: Router, private eventBus: NgEventBus) {
    this.propertiesTableColumns = ['name', 'type', 'cardinality'];

    this.parentsChipListTemplateContext = {
      title: 'Parents',
      chips: []
    };

    this.childrenChipListTemplateContext = {
      title: 'Children',
      chips: []
    };
  }

  refreshDefinition(concept: Concept) {
    this.propertiesTableData = [];
    if (!concept)
      return;

      if (concept.Property != null || concept.Property != undefined) {
        concept.Property.forEach(c => this.propertiesTableData.push(c));
      }

    this.service.getAncestorDefinitions(concept.iri).subscribe(
      (result) => this.addInheritedProperties(result),
      (error) => this.log.error(error)
    );
  }

  refreshParents(parents) {
    this.parentsChipListTemplateContext = {
      title: 'Parents',
      chips: parents
    };
  }

  refreshChildren(children) {
    this.childrenChipListTemplateContext = {
      title: 'Children',
      chips: children
    };
  }

  addInheritedProperties(ancestors: Concept[]) {
    const l = ancestors.length;
    this.ancestorsTableDataList = new Array(l);
    for(let i = 0; i < l; i++) {
      this.ancestorsTableDataList[i] = []
      if (ancestors[i].Property != null) {
        ancestors[i].Property.forEach(c => this.ancestorsTableDataList[i].push(c));
      }
    }
    this.ancestors = ancestors;
  }

  onClick(iri: string) {
    this.eventBus.cast('app:conceptSummary', iri);
  }

  onDblClick(iri: string) {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  get DEFAULT_MIN_CARDINALITY(): number {
    return HealthRecordTabularViewComponent.DEFAULT_MIN_CARDINALITY;
  }

  get DEFAULT_MAX_CARDINALITY(): string {
    return HealthRecordTabularViewComponent.DEFAULT_MAX_CARDINALITY;
  }
}

interface ChipListTemplateContext {
  title: string;
  chips: ConceptReferenceNode[];
}

export {
  HealthRecordTabularViewComponent,
  ChipListTemplateContext
};
