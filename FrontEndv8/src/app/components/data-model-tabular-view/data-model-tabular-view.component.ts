import {Component, Input} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {DataModelDefinition, FlatProperty} from '../../models/DataModelDefinition';
import {Router} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { Concept } from 'src/app/models/Concept';

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
  private iri: string;

  dataModelDefinition: DataModelDefinition;

  parentsTable: DataTable<Concept>;
  childrenTable: DataTable<Concept>;
  propertiesTable: DataTable<FlatProperty>;

  parentsHierarchyTemplateContext: HierarchyTemplateContext;
  childrenHierarchyTemplateContext: HierarchyTemplateContext;

  @Input()
  set conceptIri(iri: string) {
      this.iri = iri;
      this.refresh();
  }

  constructor(private service: ConceptService, private log: LoggerService, private router: Router) { 
    this.parentsTable = new DataTable<Concept>(["hname", "hiri", "hdescription"]);
    this.childrenTable = new DataTable<Concept>(["hname", "hiri", "hdescription"]);
    this.propertiesTable = new DataTable<FlatProperty>(["name", "iri", "description", "type", "minCardinality",  "maxCardinality"]);

    this.parentsHierarchyTemplateContext =  {
      title: "Parents",
      table: this.parentsTable
    };

    this.childrenHierarchyTemplateContext =  {
      title: "Children",
      table: this.childrenTable
    };
  }

  refresh() {
    let dataModelDefinitionObservable: Observable<DataModelDefinition> = this.service.getDataModelDefinition(this.iri);
   
    this.parentsTable.clear();
    this.childrenTable.clear();
    this.propertiesTable.clear();
    
    dataModelDefinitionObservable.subscribe(dataModelDefinition => {
      this.dataModelDefinition = dataModelDefinition;
      
      this.parentsTable.setRows(this.dataModelDefinition.getDirectParentConcepts());
      this.childrenTable.setRows(this.dataModelDefinition.getDirectChildConcepts());
      this.propertiesTable.setRows(this.dataModelDefinition.getFlatProperties());
    });
  }

  openDataModel(iri: string) {
    this.router.navigate(['dataModel'], {queryParams: {id: iri}});
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

  getTooltip(concept: Concept): string { 
    return `IRI - ${concept.iri} Description - ${concept.description ? concept.description : 'no data found'}`;
  }
}

interface HierarchyTemplateContext {
  title: string,
  table: DataTable<Concept>;
}

export {
  DataModelTablularViewComponent,
  DataTable,
  HierarchyTemplateContext
}
