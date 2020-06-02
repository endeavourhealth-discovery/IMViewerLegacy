import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { AppRoot } from './app-root';
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

/* Add Amplify imports */
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import {SecurityModule} from './security/security.module';
import {ConfirmComponent} from './security/confirm/confirm.component';
import {MainPageModule} from './main-page/main-page.module';
import {MainPageComponent} from './main-page/main-page.component';
import {ComponentsModule} from './components/components.module';
import {DataModelModule} from './data-model/data-model.module';
import {DataModelLibraryComponent} from './data-model/data-model-library/data-model-library.component';
import {ValueSetModule} from './value-sets/value-set.module';
import {ValueSetLibraryComponent} from './value-sets/value-set-library/value-set-library.component';
import {OntologyModule} from './ontology/ontology.module';
import {OntologyLibraryComponent} from './ontology/ontology-library/ontology-library.component';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    SecurityModule,
    ComponentsModule,
    MainPageModule,
    OntologyModule,
    DataModelModule,
    ValueSetModule,

    RouterModule.forRoot([
        {path: '', redirectTo: '/mainPage', pathMatch: 'full', canActivate: [AuthGuard]},

        {path: 'login', component: LoginComponent},
        {path: 'login/:username', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'register/:username', component: RegisterComponent},
        {path: 'confirm/:username', component: ConfirmComponent},

        {path: 'mainPage', component: MainPageComponent, canActivate: [AuthGuard]},

        {path: 'ontology', component: OntologyLibraryComponent, canActivate: [AuthGuard]},
        {path: 'ontology/:id', component: OntologyLibraryComponent, canActivate: [AuthGuard]},

        {path: 'dataModel', component: DataModelLibraryComponent, canActivate: [AuthGuard]},
        {path: 'dataModel/:id', component: DataModelLibraryComponent, canActivate: [AuthGuard]},

        {path: 'valueSets', component: ValueSetLibraryComponent, canActivate: [AuthGuard]},
        {path: 'valueSets/:id', component: ValueSetLibraryComponent, canActivate: [AuthGuard]},
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
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  declarations: [AppRoot],
  bootstrap: [AppRoot],
})
export class AppModule { }
