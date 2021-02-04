/* Add Amplify imports */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import Amplify from 'aws-amplify';
import { NgEventBus } from 'ng-event-bus';
import { CookieService } from 'ngx-cookie-service';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import awsconfig from '../aws-exports';
import { AppRoot } from './app-root';
import { ComponentsModule } from './components/components.module';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from './layout/layout.module';
import { monacoConfig } from './monaco';
import { AuthGuard } from './security/auth-guard';
import { ConfirmComponent } from './security/confirm/confirm.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { RouteGuard } from './security/route-guard';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security/security.service';
import { LoggerService } from './services/logger.service';
import { Perspectives } from './services/perspective.service';


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
