import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  username: string;
  code: string;
  error: string;

  constructor(private authSvc: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => this.username = params.username
    );
  }

  onSubmit() {
    this.error = '';
    this.authSvc.confirm(this.username, this.code).subscribe(
      (result) => this.router.navigate(['/login']),
      (error) => this.error = error.message
    );
  }
}
