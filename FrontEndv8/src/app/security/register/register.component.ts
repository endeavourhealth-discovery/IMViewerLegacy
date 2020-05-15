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
  password: string;
  email: string;
  loading: boolean;
  error: string;

  constructor(private authSvc: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authSvc.register(this.username, this.password, this.email).subscribe(
      (result) => {
          this.router.navigate(['confirm', this.username]);
      },
      (error) => {
        this.error = error.message;
      }
    );
  }
}
