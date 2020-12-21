import { ConceptReferenceNode } from '../../models/objectmodel/ConceptReferenceNode';
import { NgEventBus } from 'ng-event-bus';
import { Component, Input } from '@angular/core';
import { ConceptService } from '../../services/concept.service';
import { DataModelDefinition, FlatProperty } from '../../models/old/DataModelDefinition';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Concept } from '../../models/objectmodel/Concept';
import { ClassExpression } from '../../models/objectmodel/ClassExpression';
import {LoggerService} from '../../services/logger.service';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'data-model-tabular-view',
  templateUrl: './data-model-tabular-view.component.html',
  styleUrls: ['./data-model-tabular-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

class DataModelTablularViewComponent {
  static DEFAULT_MIN_CARDINALITY: number = 0;
  static DEFAULT_MAX_CARDINALITY: string = "*";

  dataModelDefinition: DataModelDefinition;

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

    if (concept.SubClassOf != null)
      concept.SubClassOf.forEach(exp => this.addExpressionToPropertiesTableData(exp, tableData));

    return tableData;
  }

  addExpressionToPropertiesTableData(expression: ClassExpression, tableData: any[]) {
    if (expression.ObjectPropertyValue || expression.DataPropertyValue)
      tableData.push(expression);
    if (expression.Intersection)
      expression.Intersection.forEach(exp => this.addExpressionToPropertiesTableData(exp, tableData));
  }

  compare(a: any, b: any) {
    if (this.isObjectProperty(a)) {
      if (this.isObjectProperty(b))
        return a.ObjectPropertyValue.Property.name.localeCompare(b.ObjectPropertyValue.Property.name, undefined, { sensitivity: 'accent' });
      else
        return a.ObjectPropertyValue.Property.name.localeCompare(b.DataPropertyValue.Property.name, undefined, { sensitivity: 'accent' });
    } else {
      if (this.isObjectProperty(b))
        return a.DataPropertyValue.Property.name.localeCompare(b.ObjectPropertyValue.Property.name, undefined, { sensitivity: 'accent' });
      else
        return a.DataPropertyValue.Property.name.localeCompare(b.DataPropertyValue.Property.name, undefined, { sensitivity: 'accent' });
    }
  }

  onClick(iri: string) {
    this.eventBus.cast('app:conceptSummary', iri);
  }

  onDblClick(iri: string) {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  isObjectProperty(row: ClassExpression): boolean {
    return row.ObjectPropertyValue && row.ObjectPropertyValue.Property.iri != null;
  }

  isDataProperty(row: ClassExpression): boolean {
    return row.DataPropertyValue && row.DataPropertyValue.Property.iri != null;
  }

  get DEFAULT_MIN_CARDINALITY(): number {
    return DataModelTablularViewComponent.DEFAULT_MIN_CARDINALITY;
  }

  get DEFAULT_MAX_CARDINALITY(): string {
    return DataModelTablularViewComponent.DEFAULT_MAX_CARDINALITY;
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
  DataModelTablularViewComponent,
  DataTable,
  ChipListTemplateContext
};
