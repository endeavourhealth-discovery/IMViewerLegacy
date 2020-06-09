import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {Property} from '../../models/Property';
import {AuthenticationService} from '../../security/auth.service';
import {ConceptTreeViewComponent} from 'im-common/im-controls';

@Component({
  selector: 'app-ontology-library',
  templateUrl: './ontology-library.component.html',
  styleUrls: ['./ontology-library.component.scss']
})
export class OntologyLibraryComponent implements OnInit {
  concept: Concept;
  definition: Related[];
  properties: Property[];
  selectedIri: string;
  searchSize = 72;
  root = ':CM_ValueTerminology';
  relationships = [':SN_116680003'];
  @ViewChild(ConceptTreeViewComponent, {static: true}) treeView: ConceptTreeViewComponent;

  constructor(private service: ConceptService,
              private auth: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService) {
  }

  ngOnInit() {
    // Direct URL nav - need to push to tree
    this.route.params.subscribe(
      (params) => this.displayConcept((params.id) ? params.id : this.root),
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
        (result) => this.properties = result,
        (error) => this.log.error(error)
      );
    }
  }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['ontology', iri]);
    }
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  home() {
    window.open('#/mainPage', 'IMViewer_MainPage');
  }

  logout() {
    this.auth.logout();
  }
}
