import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {Property} from '../../models/Property';
import {ConceptTreeViewComponent} from 'im-common/im-controls';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-ontology-library',
  templateUrl: './ontology-library.component.html',
  styleUrls: ['./ontology-library.component.scss']
})
export class OntologyLibraryComponent implements OnInit {
  concept: Concept;
  definition: any[];
  property: Property[];
  selectedIri: string;
  searchSize = 72;
  root = ':1301000252100';
  relationships = ['sn:116680003'];
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


  @ViewChild(ConceptTreeViewComponent, {static: true}) treeView: ConceptTreeViewComponent;

  constructor(private service: ConceptService,
              private auth: KeycloakService,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService) {
                this.routeEvent(this.router);
  }

  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd && this.concept !== undefined) {
        this.history.unshift(
          {
            url: e.url,
            concept: this.concept
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

      this.service.getDefinition(iri).subscribe(
        (result) => this.definition = result,
        (error) => this.log.error(error)
      );

      this.service.getProperties(iri).subscribe(
        (result) => this.property = result,
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

  json(object: any): string {
    return JSON.stringify(object);
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['ontology'], {queryParams: {id: iri}});
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  logout() {
    this.auth.logout();
  }
}
