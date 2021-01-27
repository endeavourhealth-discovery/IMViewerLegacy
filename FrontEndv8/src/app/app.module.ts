/* Add Amplify imports */
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

import {NgJsonEditorModule} from 'ang-jsoneditor';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AppRoot} from './app-root';
import {CommonModule} from '@angular/common';
import {SecurityService} from './security/security.service';
import {NgEventBus} from 'ng-event-bus';
import {LoggerService} from './services/logger.service';
import {Perspectives} from './services/perspective.service';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {monacoConfig} from './monaco';
import {SecurityModule} from './security/security.module';
import {CookieService} from 'ngx-cookie-service';
import {ComponentsModule} from './components/components.module';
import {LoginComponent} from './security/login/login.component';
import {RegisterComponent} from './security/register/register.component';
import {ConfirmComponent} from './security/confirm/confirm.component';
import {LayoutComponent} from './layout/layout.component';
import {AuthGuard} from './security/auth-guard';
import {RouteGuard} from './security/route-guard';
import {LayoutModule} from './layout/layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

let routes = [
  {path: '', redirectTo: '/perspective/mainPage', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},
  {path: 'login/:username', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/:username', component: RegisterComponent},
  {path: 'confirm/:username', component: ConfirmComponent},

  {
    path: 'perspective', component: LayoutComponent, canActivate: [AuthGuard, RouteGuard], children: [
      // Redirects to null ID's to prevent page refresh on navigate
      {path: 'ontology', redirectTo: '/perspective/ontology/', pathMatch: 'full'},
      {path: 'healthRecord', redirectTo: '/perspective/healthRecord/', pathMatch: 'full'},
      {path: 'valueSets', redirectTo: '/perspective/valueSets/', pathMatch: 'full'},

      // Main paths/pages
      {path: 'mainPage', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#'}},
      {path: 'healthRecordOverview', loadChildren: () => import('./pages/health-record-overview/health-record-overview.module').then(m => m.HealthRecordOverviewModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Data_models'}},
      {path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Search'}},
      {path: 'ontology/:id', loadChildren: () => import('./pages/ontology/ontology.module').then(m => m.OntologyModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Semantic_ontology'}},
      {path: 'healthRecord/:id', loadChildren: () => import('./pages/health-record/health-record.module').then(m => m.HealthRecordModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Data_models'}},
      {path: 'valueSets/:id', loadChildren: () => import('./pages/value-sets/value-set.module').then(m => m.ValueSetModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Value_sets'}},
      {path: 'dataMaps', loadChildren: () => import('./pages/maps/maps.module').then(m => m.MapsModule), data: {role: 'information-manager:conceptLibrary', helpContext: '#Maps'}},
    ]
  }
];

@NgModule({
  imports: [
    AmplifyUIAngularModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    CommonModule,
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(monacoConfig),
    SecurityModule,
    ComponentsModule,
    LayoutModule
  ],
  declarations: [
    AppRoot
  ],
  bootstrap: [AppRoot],
  providers: [
    CookieService,
    Perspectives,
    SecurityService,
    LoggerService,
    NgEventBus
  ]
})
export class AppModule {
}
