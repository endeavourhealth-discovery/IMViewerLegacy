import {Injectable} from '@angular/core';
import {Routes} from '@angular/router';
import {AbstractMenuProvider, MenuOption} from 'dds-angular8/core';
import {MainPageComponent} from './main-page/main-page.component';
import { DataModelOverviewLibraryComponent } from './pages/data-model/data-model-overview/data-model-overview-library/data-model-overview-library.component';
import { ValueSetLibraryComponent } from './pages/value-sets/value-set-library/value-set-library.component';
import { OntologyLibraryComponent } from './pages/ontology/ontology-library/ontology-library.component';
import { DataModelLibraryComponent } from './pages/data-model/data-model-library/data-model-library.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {User} from './security/models/User';

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
    this.menu = [
      {
        "caption": "Main Menu",
        "state": "mainPage",
        "icon": "fas fa-home"
      },
      {
        "caption": "Ontology Viewer",
        "state": "ontology",
        "icon": "fas fa-lightbulb"
      },
      {
        "caption": "Data Model Viewer",
        "state": "dataModel",
        "icon": "fas fa-sitemap"
      },
      {
        "caption": "Value Set Viewer",
        "state": "valueSets",
        "icon": "fas fa-tasks"
      },
      {
        "caption": "About",
        "state": "https://wiki.discoverydataservice.org/index.php?title=Common_information_model",
        "icon": "fas fa-info"
      }
    ];
/*
    this.http.get<any>(environment.api + 'api/config/appMenu').subscribe(
      (result) => result.applications.forEach(mo => this.menu.push(mo)),
      (error) => console.log(error)
    );
*/
    return this.menu;
  }

  setMenuBadge(index: number, value: string) {
    this.menu[index].badge = value;
  }
}
