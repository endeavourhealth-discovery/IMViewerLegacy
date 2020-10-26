import { ConceptService } from './../../../concept.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface Property {
  position: number;
  relationship: string;
  concept: string;
}

@Component({
  selector: 'app-data-model-dialog',
  templateUrl: './data-model-dialog.component.html',
  styleUrls: ['./data-model-dialog.component.scss']
})

export class DataModelDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DataModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ConceptService) { }

  displayedColumns: string[] = ['position', 'relationship', 'concept', 'remove'];
  dataSource = [
    { position: 1, relationship: '', concept: '' },
  ];

  // AutoComplete
  relationshipControl = new FormControl();
  filteredRelationshipOptions: Observable<any[]>;
  conceptControl = new FormControl();
  filteredConceptOptions: Observable<any[]>;

  ngOnInit() {
    this.filteredRelationshipOptions = this.relationshipControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(value => this._filter(value))
      );

    this.filteredConceptOptions = this.conceptControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(value => this._filter(value))
      );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    if (value.length > 5) {
      return this.service.search(value, ':DiscoveryCommonDataModel', []).pipe(
        filter(data => !!data),
        map((data) => {
          return data.filter(option => option.name.toLowerCase().includes(filterValue))
        })
      );
    } else {
      let options: any[] = [{ iri: ':Encounter', name: 'Encounter (record entry)', description: '' },
      { iri: ':CriticalCareEncounter', name: 'Critical care encounter (record entry)', description: '' },
      { iri: ':IsA', name: 'Is a', description: '' }];
      return options.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  selectedRelationship(selectedValue, position) {
    this.dataSource[position - 1].relationship = selectedValue;
  }

  selectedConcept(selectedValue, position) {
    this.dataSource[position - 1].concept = selectedValue;
  }

  addProperty() {
    this.dataSource.push(
      { position: this.dataSource.length + 1, relationship: '', concept: '' }
    );

    this.dataSource = [...this.dataSource];
  }

  removeProperty(position) {
    this.dataSource.pop();
    this.dataSource = [...this.dataSource];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
