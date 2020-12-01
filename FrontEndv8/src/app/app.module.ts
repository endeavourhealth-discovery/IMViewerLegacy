import { ValueSetModule } from './pages/value-sets/value-set.module';
import { DataModelOverviewModule } from './pages/data-model/data-model-overview/data-model-overview.module';
import { OntologyModule } from './pages/ontology/ontology.module';
import { DataModelModule } from './pages/data-model/data-model.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgModule } from '@angular/core';
import {AppConfig} from './app-config.service';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
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
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MainPageComponent} from './main-page/main-page.component';
import {OntologyLibraryComponent} from './pages/ontology/ontology-library/ontology-library.component';
import {DataModelLibraryComponent} from './pages/data-model/data-model-library/data-model-library.component';
import {ValueSetLibraryComponent} from './pages/value-sets/value-set-library/value-set-library.component';
import {DataModelOverviewLibraryComponent} from './pages/data-model/data-model-overview/data-model-overview-library/data-model-overview-library.component';
import {LoggerService} from './services/logger.service';

let routes = [
  {path: '', redirectTo: '/mainPage', pathMatch: 'full'},
  {path: 'mainPage', component: MainPageComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#mainPage'}},
  {path: 'ontology', component: OntologyLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#ontology'}},
  {path: 'dataModel', component: DataModelLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#dataModel'}},
  {path: 'valueSets', component: ValueSetLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#valueSets'}},
  {path: 'dataModelOverview', component: DataModelOverviewLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#overview'}},
];

@NgModule({
  imports: [
    HttpClientModule,
    DataModelModule,
    MainPageModule,
    OntologyModule,
    DataModelModule,
    DataModelOverviewModule,
    ValueSetModule,
    RouterModule.forRoot(routes, {useHash: true}),
    MatToolbarModule,
    MatMenuModule,
    CommonModule,
    MatProgressSpinnerModule,
    FlexModule,
    MatButtonModule,
    MatTooltipModule,
    NgJsonEditorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatDividerModule,
    MatAutocompleteModule
  ],
  declarations: [
    AppRoot
  ],
  bootstrap: [AppRoot],
  providers: [
    AppConfig,
    { provide: AbstractSecurityProvider, useClass: MockSecurityService },
    LoggerService,
    NgEventBus,
  ]
})
export class AppModule  {
}
