import { ValueSetModule } from './pages/value-sets/value-set.module';
import { DataModelOverviewModule } from './pages/data-model/data-model-overview/data-model-overview.module';
import { OntologyModule } from './pages/ontology/ontology.module';
import { DataModelModule } from './pages/data-model/data-model.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgModule } from '@angular/core';
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
import {Perspectives} from './services/perspective.service';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {monacoConfig} from './monaco';
import {SecurityModule} from './security/security.module';
import {CookieService} from 'ngx-cookie-service';
import { SearchComponent } from './pages/search/search/search.component';
import {MatCardModule} from '@angular/material/card';
import {ComponentsModule} from './components/components.module';
import {FormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';

let routes = [
  {path: '', redirectTo: '/mainPage', pathMatch: 'full'},
  {path: 'mainPage', component: MainPageComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#'}},
  {path: 'ontology', component: OntologyLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Semantic_ontology'}},
  {path: 'ontology/:id', component: OntologyLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Semantic_ontology'}},
  {path: 'dataModel', component: DataModelLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Data_models'}},
  {path: 'dataModel/:id', component: DataModelLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Data_models'}},
  {path: 'valueSets', component: ValueSetLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Value_sets_or_concept_sets_or_reference_sets'}},
  {path: 'valueSets/:id', component: ValueSetLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Value_sets_or_concept_sets_or_reference_sets'}},
  {path: 'dataModelOverview', component: DataModelOverviewLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Data_models'}},
  {path: 'search', component: SearchComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#Search'}},
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
    MatAutocompleteModule,
    MonacoEditorModule.forRoot(monacoConfig),
    SecurityModule,
    MatCardModule,
    ComponentsModule,
    FormsModule,
    MatSlideToggleModule,
    MatListModule,
    MatSelectModule
  ],
  declarations: [
    AppRoot,
    SearchComponent
  ],
  bootstrap: [AppRoot],
  providers: [
    CookieService,
    Perspectives,
    { provide: AbstractSecurityProvider, useClass: MockSecurityService },
    LoggerService,
    NgEventBus
  ]
})
export class AppModule  {
}
