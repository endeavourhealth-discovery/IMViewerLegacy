import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  email: string;
  forename: string;
  surname: string;
  avatar: string;
  loading: boolean;
  error: string;
  returnUrl: string;

  constructor(private authSvc: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.route.params.subscribe(
      (params) => this.username = params.username
    );
  }

  onSubmit() {
    this.authSvc.register(
      this.username,
      this.password,
      this.email,
      this.forename,
      this.surname,
      this.avatar).subscribe(
      (result) => {
          this.router.navigate(['confirm', this.username], { queryParams: { returnUrl: this.returnUrl } });
      },
      (error) => {
        this.error = error.message;
      }
    );
  }
}
