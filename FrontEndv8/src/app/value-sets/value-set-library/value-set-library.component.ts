import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../services/concept.service';
import {Concept} from '../../models/Concept';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {ConceptTreeViewComponent} from 'im-common/im-controls';
import {SchemeCount} from '../../models/SchemeCount';
import {MemberDialogComponent} from '../member-dialog/member-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ValueSetMember} from '../../models/ValueSetMember';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-value-set-library',
  templateUrl: './value-set-library.component.html',
  styleUrls: ['./value-set-library.component.scss']
})
export class ValueSetLibraryComponent implements OnInit {
  concept: Concept;
  members: ValueSetMember[];
  selectedIri: string;
  searchSize = 72;
  root = ':VSET_ValueSet';
  relationships = ['sn:116680003'];
  nameCache = {};
  hoveredConcept: Concept = {
    name: '',
    description: '',
    iri: '',
    code: '',
    id: '',
    namespace: null,
    scheme: null,
    status: null,
    weighting: null
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
              private log: LoggerService,
              private dialog: MatDialog) {
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
      this.nameCache = {};
      this.members = null;
      this.selectedIri = iri;
      this.service.getConcept(iri).subscribe(
        (result) => this.concept = result,
        (error) => this.log.error(error)
      );

      this.service.getValueSetMembers(iri).subscribe(
        (result) => this.members = result,
        (error) => this.log.error(error)
      );
    }
  }

  getJson(object: any) {
    return JSON.stringify(object);
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

  sumCounts(counts: SchemeCount[]) {
    if (!counts)
      return 0;

    let total = 0;
    for(let c of counts)
      total += c.count;

    return total;
  }

  expand(item: ValueSetMember) {
    if (item && !item.counts) {
      this.service.getChildCountByScheme(item.iri).subscribe(
        (result) => item.counts = result,
        (error) => this.log.error(error)
      )
    }
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['valueSets'], {queryParams: {id: iri}});
    }
  }

  gotoConcept(iri: string) {
      console.log("gotoConcept > " + iri);
      this.router.navigate(['ontology'], {queryParams: {id: iri}});
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  viewChildren(item: ValueSetMember, scheme?: string) {
    console.log('Viewing children of ' + item.iri + ' (scheme ' + scheme + ')');
    MemberDialogComponent.open(this.dialog, item.iri, scheme).subscribe();
  }

  getCode(iri: string) {
    return iri.substring(iri.indexOf('_') + 1);
  }

  logout() {
    this.auth.logout();
  }
}
