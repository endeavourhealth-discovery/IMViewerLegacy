import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string;
  password1: string;
  password2: string;
  firstName: string;
  lastName: string;
  loading: boolean;
  error: string;

  constructor(private authSvc: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.password1 !== this.password2) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authSvc.register(this.username, this.firstName, this.lastName, this.password1).subscribe(
      (data) => {
        if (data.token) {
          this.router.navigate(['']);
        } else {
          this.error = data.message;
          this.loading = false;
        }
      },
      (error) => {
      }
    );
  }
}
