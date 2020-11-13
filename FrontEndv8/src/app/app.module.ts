import { ValueSetModule } from './pages/value-sets/value-set.module';
import { DataModelOverviewModule } from './pages/data-model/data-model-overview/data-model-overview.module';
import { OntologyModule } from './pages/ontology/ontology.module';
import { DataModelModule } from './pages/data-model/data-model.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {AppMenuService} from './app-menu.service';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AbstractMenuProvider, LoggerModule, SecurityModule} from 'dds-angular8';
import {AppRoot} from './app-root';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MainPageModule} from './main-page/main-page.module';
import {AbstractSecurityProvider} from './security/abstract-security-provider';
import {MockSecurityService} from './security/mock-security.service';
import { NgEventBus } from 'ng-event-bus';

const keycloakService = new KeycloakService();

@NgModule({
  imports: [
    KeycloakAngularModule,
    HttpClientModule,
    SecurityModule,
    LoggerModule,
    DataModelModule,
    MainPageModule,
    OntologyModule,
    DataModelModule,
    DataModelOverviewModule,
    ValueSetModule,
    RouterModule.forRoot(AppMenuService.getRoutes(), {useHash: true}),
    MatToolbarModule,
    MatMenuModule,
    CommonModule,
    MatProgressSpinnerModule,
    FlexModule,
    MatButtonModule,
    MatTooltipModule,
    NgJsonEditorModule
  ],
  declarations: [
    AppRoot
  ],
  bootstrap: [AppRoot],
  providers: [
    { provide: AbstractSecurityProvider, useClass: MockSecurityService },
    { provide: AbstractMenuProvider, useClass : AppMenuService },
    { provide: KeycloakService, useValue: keycloakService },
    NgEventBus,
  ]
})
export class AppModule  {
}
