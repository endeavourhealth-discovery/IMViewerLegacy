import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConceptService} from '../../services/concept.service';
import {forkJoin} from 'rxjs';
import {Router} from '@angular/router';
import {LoggerService} from '../../services/logger.service';
import {Perspectives} from '../../services/perspective.service';
import {ConceptReference} from '../../models/objectmodel/ConceptReference';

@Component({
  selector: 'app-find-concept-usages-dialog',
  templateUrl: './find-concept-usages-dialog.component.html',
  styleUrls: ['./find-concept-usages-dialog.component.scss']
})
export class FindConceptUsagesDialogComponent implements OnInit {

  static execute(dialog: MatDialog, concept: ConceptReference) {
      const dialogRef = dialog.open(FindConceptUsagesDialogComponent, {
        width: '50%',
        data: { concept: concept }
      });

      return dialogRef.afterClosed();
  }

  candidates = [':VSET_ValueSet', ':DiscoveryCommonDataModel', ':dataModelObjectProperty'];
  types: ConceptReference[]
  usages: any[];

  constructor(
    public dialogRef: MatDialogRef<FindConceptUsagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ConceptService,
    private log: LoggerService,
    private router: Router,
    public perspectives: Perspectives
  ) { }

  ngOnInit() {
    this.service.isOfType(this.data.concept.iri, this.candidates)
      .subscribe(
        (result) => this.types = result,
        (error) => this.log.error(error)
      );
    this.service.findUsages(this.data.concept.iri)
      .subscribe(
        (result) => this.addTypes(result),
        (error) => this.log.error(error)
      );
  }

  addTypes(items: any[]) {
    if (items == null || items.length == 0) {
      this.usages = items;
      return;
    }

    let requests = items.map(i => this.service.isOfType(i.iri, this.candidates));
    forkJoin(requests).subscribe(
      (result) => {
        for(let i = 0; i < result.length; i++) {
          items[i].types = result[i];

        }
        this.usages = items;
        console.log(items);
      },
      (error) => this.log.error(error)
    )
  }

  navigate(iri: string, type: string = '') {
    this.dialogRef.close();
    switch (type) {
      case ':VSET_ValueSet':
        this.router.navigate([this.perspectives.valueSets.primary.state], { queryParams: { id: iri } });
        break;
      case ':DiscoveryCommonDataModel':
      case ':dataModelObjectProperty':
        this.router.navigate([this.perspectives.dataModel.primary.state], { queryParams: { id: iri } });
        break;
      default:
        this.router.navigate([this.perspectives.ontology.primary.state], { queryParams: { id: iri } });
        break;
    }
  }

  getColor(type: string) {
    switch (type) {
      case ':VSET_ValueSet':
        return this.perspectives.valueSets.color;
      case ':DiscoveryCommonDataModel':
      case ':dataModelObjectProperty':
        return this.perspectives.dataModel.color;
      default:
        return this.perspectives.ontology.color;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
