import {Injectable} from '@angular/core';
import {Routes} from '@angular/router';
import {AbstractMenuProvider, MenuOption} from 'dds-angular8/core';
import {MainPageComponent} from './main-page/main-page.component';
import {OntologyLibraryComponent} from './ontology/ontology-library/ontology-library.component';
import {DataModelLibraryComponent} from './data-model/data-model-library/data-model-library.component';
import {ValueSetLibraryComponent} from './value-sets/value-set-library/value-set-library.component';
import {DataModelOverviewLibraryComponent} from './data-model-overview/data-model-overview-library/data-model-overview-library.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {QuickMenu} from './QuickMenu';

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

  private appMenu: any;

  constructor(private http: HttpClient) {
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

  loadAppMenu(): Observable<QuickMenu> {
    return this.http.get<QuickMenu>('api/config/appMenu');
  }
}
