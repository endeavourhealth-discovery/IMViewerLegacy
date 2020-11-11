import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ConceptService} from '../../services/concept.service';
import {DataModelDefinition, FlatProperty} from '../../models/old/DataModelDefinition';
import {Router} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { Concept } from '../../models/objectmodel/Concept';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'data-model-tabular-view',
  templateUrl: './data-model-tabular-view.component.html',
  styleUrls: ['./data-model-tabular-view.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

class DataModelTablularViewComponent {
  private static UNDEFINED_CONCEPT: Concept;

  private iri: string;

  dataModelDefinition: DataModelDefinition;

  propertiesTable: DataTable<FlatProperty>;

  parentsChipListTemplateContext: ChipListTemplateContext;
  childrenChipListTemplateContext: ChipListTemplateContext;

  @Input()
  set conceptIri(iri: string) {
      this.iri = iri;
      this.refresh();
  }

  @Output()
  selection: EventEmitter<string>;

  @Output()
  hover = new EventEmitter<Concept>();

  constructor(private service: ConceptService, private log: LoggerService, private router: Router) {
    this.selection = new EventEmitter<string>();
    this.hover = new EventEmitter<Concept>();

    this.propertiesTable = new DataTable<FlatProperty>(["name", "type", "cardinality", "description", "declaredOn"]);

    this.parentsChipListTemplateContext =  {
      title: "Parents",
      chips: []
    };

    this.childrenChipListTemplateContext =  {
      title: "Children",
      chips: []
    };
  }

  refresh() {
    let dataModelDefinitionObservable: Observable<DataModelDefinition> = this.service.getDataModelDefinition(this.iri);

    this.propertiesTable.clear();

    dataModelDefinitionObservable.subscribe(dataModelDefinition => {
      this.dataModelDefinition = dataModelDefinition;

      this.parentsChipListTemplateContext.chips = this.dataModelDefinition.getDirectParentConcepts();
      this.childrenChipListTemplateContext.chips = this.dataModelDefinition.getDirectChildConcepts();

      this.propertiesTable.setRows(this.dataModelDefinition.getFlatProperties());
    });
  }

  onSelect(concept: Concept) {
    this.selection.emit(concept.iri);
  }

  onHoverOver(concept: Concept) {
    console.log(`in onHoverOver ${JSON.stringify(concept)}`);
    this.hover.emit(concept);
  }

  onHoverOut() {
    console.log(`in onHoverOut`);
    this.hover.emit(DataModelTablularViewComponent.UNDEFINED_CONCEPT);
  }
}

class DataTable<D> {

  public columns: string[]
  public rows: MatTableDataSource<D> = new MatTableDataSource<D>();

  constructor(columns: string[]) {
    this.columns = columns;
  }

  setRows(rows: D[]){
    this.rows.data = rows;
  }

  clear() {
    this.rows.data = [];
  }

  hasRows() : boolean {
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
  title: string,
  chips: Concept[];
}

export {
  DataModelTablularViewComponent,
  DataTable,
  ChipListTemplateContext
}
