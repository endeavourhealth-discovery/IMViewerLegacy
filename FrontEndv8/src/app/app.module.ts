import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {RecordModelLibraryComponent} from './record-model-library/record-model-library/record-model-library.component';
import {RecordModelModule} from './record-model-library/record-model.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { AppRoot } from './app-root';
import {ErrorInterceptor} from './security/error-intercept';
import {BasicAuthInterceptor} from './security/auth-intercept';
import {AuthGuard} from './security/auth-guard';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    RecordModelModule,

    RouterModule.forRoot([
        {path: '', redirectTo: '/recordModel', pathMatch: 'full', canActivate: [AuthGuard]},
        {path: 'recordModel', component: RecordModelLibraryComponent, data: {root: ':DM_RecordModel'}, canActivate: [AuthGuard]},
        {path: 'recordModel/:id', component: RecordModelLibraryComponent, data: {root: ':DM_RecordModel'}, canActivate: [AuthGuard]},
        {path: 'dataModel', component: RecordModelLibraryComponent, data: {root: ':DM_DataModel'}, canActivate: [AuthGuard]},
        {path: 'dataModel/:id', component: RecordModelLibraryComponent, data: {root: ':DM_DataModel'}, canActivate: [AuthGuard]},

        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
      ],
      {useHash: true}),
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FlexModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  declarations: [AppRoot, LoginComponent, RegisterComponent],
  bootstrap: [AppRoot],
})
export class AppModule { }
