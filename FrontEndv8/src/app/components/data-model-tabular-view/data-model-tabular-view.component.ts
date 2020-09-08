import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {DataModelDefinition} from '../../models/DataModelDefinition';
import {Property} from '../../models/Property';
import {LoggerService} from 'dds-angular8/logger';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';

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
  dataModelPropertyTable: DataModelPropertyTable;

  @Input()
  set conceptIri(iri: string) {
      this.iri = iri;
      this.refresh();
  }

  constructor(private service: ConceptService, private log: LoggerService) { }

  refresh() {
    let dataModelDefinitionObservable: Observable<DataModelDefinition> = this.service.getDataModelDefinition(this.iri);
    
    this.dataModelPropertyTable = new DataModelPropertyTable();
    dataModelDefinitionObservable.subscribe(dataModelDefinition => {
      this.dataModelDefinition = dataModelDefinition;
      this.dataModelPropertyTable.setProperties(this.dataModelDefinition.properties);
    });
  }
}

class DataModelPropertyTable {

  public columns: string[] = ["name", "type", "minCardinality",  "maxCardinality"];
  public rows: MatTableDataSource<DataModelProperty> = new MatTableDataSource<DataModelProperty>();
  public expandedElement: DataModelProperty | null;

  setProperties(properties: Property[]) {
    this.rows.data = properties.map((property: Property) => {
      const dataModelProperty: DataModelProperty =  {
        name: property.property.name,
        description: property.property.description,
        type: property.valueType.name,
        minCardinality: property.minCardinality,
        maxCardinality: property.maxCardinality
      };

      return dataModelProperty;
    })
  }

  hasRows() : boolean {
    return this.rows && this.rows.data.length > 0;
  }
}

interface DataModelProperty {
  name: string;
  description: string;
  minCardinality: number;
  maxCardinality: number;
  type: string; // could be an enum
}

export {
  DataModelTablularViewComponent,
  DataModelPropertyTable,
  DataModelProperty
}
