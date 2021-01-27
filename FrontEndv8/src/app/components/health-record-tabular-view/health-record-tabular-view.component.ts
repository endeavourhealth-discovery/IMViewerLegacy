import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { NgEventBus } from 'ng-event-bus';
import { Component, Input } from '@angular/core';
import { ConceptService } from '../../services/concept.service';
import { HealthRecordDefinition, FlatProperty } from '../../models/old/HealthRecordDefinition';
import {Router} from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Concept } from '../../models/objectmodel/Concept';
import {LoggerService} from '../../services/logger.service';
import {ObjectModelVisitor} from '../../models/ObjectModelVisitor';
import {ObjectPropertyValue} from '../../models/objectmodel/ObjectPropertyValue';
import {DataPropertyValue} from '../../models/objectmodel/DataPropertyValue';

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

  healthRecordDefinition: HealthRecordDefinition;

  propertiesTable: DataTable<FlatProperty>;
  propertiesTableData: any[] = [];

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
    this.propertiesTable = new DataTable<FlatProperty>(['name', 'type', 'cardinality']);

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

    this.propertiesTableData = this.buildPropertiesTableData(concept);

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
    this.ancestors = ancestors;
    const l = ancestors.length;
    this.ancestorsTableDataList = new Array(l);
    for(let i = 0; i < l; i++) {
      this.ancestorsTableDataList[i] = this.buildPropertiesTableData(ancestors[i]);
    }
  }

  buildPropertiesTableData(concept: Concept) {
    let tableData: any[] = [];
    let omv = new ObjectModelVisitor();
    omv.ObjectPropertyValueVisitor = (opv:ObjectPropertyValue) => {tableData.push(opv)};
    omv.DataPropertyValueVisitor = (dpv:DataPropertyValue) => {tableData.push(dpv)};
    omv.visit(concept);
    return tableData;
  }

  onClick(iri: string) {
    this.eventBus.cast('app:conceptSummary', iri);
  }

  onDblClick(iri: string) {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  isObjectProperty(row): boolean {
    return (row instanceof ObjectPropertyValue);
  }

  isDataProperty(row): boolean {
    return (row instanceof DataPropertyValue);
  }

  get DEFAULT_MIN_CARDINALITY(): number {
    return HealthRecordTabularViewComponent.DEFAULT_MIN_CARDINALITY;
  }

  get DEFAULT_MAX_CARDINALITY(): string {
    return HealthRecordTabularViewComponent.DEFAULT_MAX_CARDINALITY;
  }
}

class DataTable<D> {

  public columns: string[]
  public rows: MatTableDataSource<D> = new MatTableDataSource<D>();

  constructor(columns: string[]) {
    this.columns = columns;
  }

  setRows(rows: D[]) {
    this.rows.data = rows;
  }

  clear() {
    this.rows.data = [];
  }

  hasRows(): boolean {
    return this.rows && this.rows.data.length > 0;
  }

  getRowCount(): number {
    return (this.hasRows) ? this.rows.data.length : 0;
  }

  getTooltip(concept: Concept): string {
    return `IRI - ${concept.iri} Description - ${concept.description ? concept.description : 'no data found'}`;
  }
}

interface ChipListTemplateContext {
  title: string;
  chips: ConceptReferenceNode[];
}

export {
  HealthRecordTabularViewComponent,
  DataTable,
  ChipListTemplateContext
};
