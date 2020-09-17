import { PagedResultSet } from './../../models/PagedResultSet';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {ConceptTreeViewComponent} from 'im-common/im-controls';
import {KeycloakService} from 'keycloak-angular';
import { DataModelTablularViewComponent } from '../../components/data-model-tabular-view/data-model-tabular-view.component';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss'],
})
class DataModelLibraryComponent implements OnInit {

  selectedIri: string;
  concept: Concept;

  searchSize = 72;
  root = ':DiscoveryCommonDataModel';
  relationships = ['sn:116680003'];
  selected = 'dataModel';
  showFiller = true;

  hoveredConcept: Concept = {
    name: '',
    description: '',
    iri: ''
  };

  history = [];
  properties = [];
  definitions = [];
  valuesets = [];

  timer: any;

  sidebar = false;
  textual = null;

  @ViewChild(ConceptTreeViewComponent, {static: true}) treeView: ConceptTreeViewComponent;
  @ViewChild(DataModelTablularViewComponent, {static: true}) tableView: DataModelTablularViewComponent;

  constructor(private service: ConceptService,
              private router: Router,
              private auth: KeycloakService,
              private route: ActivatedRoute,
              private log: LoggerService) {

              this.routeEvent(this.router);
  }

  routeEvent(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationEnd && this.concept != undefined){
        this.history.unshift(
          {
            'url': e.url,
            'concept': this.concept
          }
        );
      }
    });
  }

  ngOnInit() {
    // Direct URL nav - need to push to tree
    this.route.queryParamMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );
  }

  displayConcept(iri: string) {
    if (this.selectedIri !== iri) {
      this.selectedIri = iri;
      this.textual = null;
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );
    }
  }

  itemHover(concept: Concept) {
    const root = this;
    if (concept != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);
      this.hoveredConcept = concept;

      this.service.getProperties(concept.iri, false).subscribe(
        (result) => this.properties = result,
        (error) => this.log.error(error)
      );

      this.service.getDefinition(concept.iri).subscribe(
        (result) => this.definitions = result,
        (error) => this.log.error(error)
      );

      this.service.getValueSetMembers(concept.iri).subscribe(
        (result) => this.valuesets = result,
        (error) => this.log.error(error)
      );

    } else {
      clearTimeout(this.timer);
    }
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      clearTimeout(this.timer);
      this.router.navigate(['dataModel'], {queryParams: {id: iri}});
    }
  }

  getTextual(): string {
    if (!this.textual) {
      this.textual = 'Loading...';
      this.service.getTextual(this.selectedIri).subscribe(
        (result) => this.textual = result,
        (error) => this.log.error(error)
      );
    }

    return this.textual;
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  logout() {
    this.auth.logout();
  }
  
}

export {
  DataModelLibraryComponent
}
