import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../security/models/User';
import {SecurityService} from '../../security/security.service';
import {LoggerService} from '../../services/logger.service';

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class UserProfileDialog implements OnInit {
  user: User
  error: string;

  static execute(dialog: MatDialog, user: User) {
      const dialogRef = dialog.open(UserProfileDialog, { width: '50%' });
      dialogRef.componentInstance.user = user;
      return dialogRef.afterClosed();
  }

  constructor(
    public dialogRef: MatDialogRef<UserProfileDialog>,
    public service: SecurityService
  ) { }

  ngOnInit() {
  }

  onOk() {
    let update = this.service.updateUser(this.user);

    if (update != null)
      update.subscribe(
        (ok) => this.dialogRef.close(true),
        (error) => this.error = error
      )
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
