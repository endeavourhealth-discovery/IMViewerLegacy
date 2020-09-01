import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {Concept} from '../../models/Concept';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {ConceptTreeViewComponent} from 'im-common/im-controls';
import {KeycloakService} from 'keycloak-angular';
const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss'],
})
export class DataModelLibraryComponent implements OnInit {
  concept: Concept;
  selectedIri: string;
  searchSize = 72;
  root = ':DM_DataModel';
  relationships = [':SN_116680003'];
  selected = 'dataModel';

  history = [];

  @ViewChild(ConceptTreeViewComponent, {static: true}) treeView: ConceptTreeViewComponent;

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
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );
    }
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['dataModel'], {queryParams: {id: iri}});
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  logout() {
    this.auth.logout();
  }
}
