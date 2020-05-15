import { NgModule } from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ConfirmComponent} from './confirm/confirm.component';
import {AuthenticationService} from './auth.service';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {DirectivesModule} from 'dds-angular8/directives';

@NgModule({
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    DirectivesModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmComponent
  ],
  providers: [
    AuthenticationService
  ]
})
export class SecurityModule { }
