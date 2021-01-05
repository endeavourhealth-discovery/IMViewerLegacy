import { NgModule } from '@angular/core';
import {RouteGuard} from './route-guard';
import {AuthGuard} from './auth-guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ConfirmComponent} from './confirm/confirm.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmComponent
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    ConfirmComponent
  ],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    FlexModule
  ],
  providers: [
    RouteGuard,
    AuthGuard
  ]
})
export class SecurityModule { }
