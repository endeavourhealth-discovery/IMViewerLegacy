import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import {AuthenticationService} from '../auth.service';


@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  username;
  password;
  loading = false;
  returnUrl: string;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    if (this.authenticationService.getUser()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    this.error = '';
    // stop here if form is invalid
    if (!this.valid()) {
      return;
    }

//    this.loading = true;

    this.authenticationService.login(this.username, this.password).subscribe(
      (result) => this.router.navigate([this.returnUrl]),
      (error) => {
        if (error.message === 'User is not confirmed.')
          this.router.navigate(['confirm', this.username]);
        else
          this.error = error.message;
      }
    );
  }

  valid(): boolean {
    // Form validation
    return true;
  }

  register() {
    this.router.navigate(['register'], { queryParams: { returnUrl: this.returnUrl } });
  }
}
