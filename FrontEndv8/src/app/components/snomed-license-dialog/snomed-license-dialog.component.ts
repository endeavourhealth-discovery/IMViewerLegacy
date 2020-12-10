import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-snomed-license-dialog',
  templateUrl: './snomed-license-dialog.component.html',
  styleUrls: ['./snomed-license-dialog.component.scss']
})
export class SnomedLicenseDialog implements OnInit {

  static execute(dialog: MatDialog) {
      const dialogRef = dialog.open(SnomedLicenseDialog, { width: '50%' });

      return dialogRef.afterClosed();
  }

  constructor(
    public dialogRef: MatDialogRef<SnomedLicenseDialog>,
  ) { }

  ngOnInit() {
  }

  onOk() {
    this.dialogRef.close(true);
  }

  onClose() {
    // Redirect out to snomed.org
    this.dialogRef.close(false);
  }
}
