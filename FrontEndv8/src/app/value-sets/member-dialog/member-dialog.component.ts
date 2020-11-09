import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConceptService} from '../../services/concept.service';
import {LoggerService} from 'dds-angular8/logger';
import {Router} from '@angular/router';

@Component({
  selector: 'app-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.scss']
})
export class MemberDialogComponent implements OnInit {

  static open(dialog: MatDialog, iri: string, scheme: string) {
    let dialogRef = dialog.open(MemberDialogComponent, {disableClose: true, autoFocus: true});
    dialogRef.componentInstance.iri = iri;
    dialogRef.componentInstance.scheme = scheme;

    return dialogRef.afterClosed();
  }

  iri: string;
  scheme: string;
  children: any[];

  constructor(
    private service: ConceptService,
    public dialogRef: MatDialogRef<MemberDialogComponent>,
    private router: Router,
    private log: LoggerService
  ) { }

  ngOnInit() {
    this.service.getChildrenByScheme(this.iri, this.scheme)
      .subscribe(
        (result) => this.children = result,
        (error) => this.log.error(error)
      )
  }

  close() {
    this.dialogRef.close();
  }
}
