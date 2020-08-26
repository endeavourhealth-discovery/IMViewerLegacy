import {Injectable} from '@angular/core';
import {Routes} from '@angular/router';
import {AbstractMenuProvider, MenuOption} from 'dds-angular8/core';
import {MainPageComponent} from './main-page/main-page.component';
import {OntologyLibraryComponent} from './ontology/ontology-library/ontology-library.component';
import {DataModelLibraryComponent} from './data-model/data-model-library/data-model-library.component';
import {ValueSetLibraryComponent} from './value-sets/value-set-library/value-set-library.component';
import {DataModelOverviewLibraryComponent} from './data-model-overview/data-model-overview-library/data-model-overview-library.component';

@Injectable()
export class AppMenuService implements  AbstractMenuProvider {
  static getRoutes(): Routes {
    return [
      {path: '', redirectTo: '/mainPage', pathMatch: 'full'},
      {path: 'mainPage', component: MainPageComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#mainPage'}},
      {path: 'ontology', component: OntologyLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#ontology'}},
      {path: 'dataModel', component: DataModelLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#dataModel'}},
      {path: 'valueSets', component: ValueSetLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#valueSets'}},
      {path: 'dataModelOverview', component: DataModelOverviewLibraryComponent, data: {role: 'information-manager:conceptLibrary', helpContext: '#overview'}},
    ];
  }

  getClientId(): string {
    return 'information-manager';
  }

  getApplicationTitle(): string {
    return 'Information Model Viewer';
  }

  menu: MenuOption[] = [];

  getMenuOptions(): MenuOption[] {
    return this.menu;
  }

  setMenuBadge(index: number, value: string) {
    this.menu[index].badge = value;
  }

  getHomeMenu(): MenuOption {
    return {state: 'mainPage', icon: 'fas fa-home'} as MenuOption;
  }

  getApplications(): MenuOption[] {
    return [
      {caption: 'Ontology Viewer', state: 'ontology', icon: 'fas fa-lightbulb'},
      {caption: 'Data Model Viewer', state: 'dataModel', icon: 'fas fa-sitemap'},
      {caption: 'Value Set Viewer', state: 'valueSet', icon: 'fas fa-tasks'},
    ] as MenuOption[];
  }
}
