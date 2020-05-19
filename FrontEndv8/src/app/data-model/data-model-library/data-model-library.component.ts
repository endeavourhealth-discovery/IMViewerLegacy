import {Component, OnInit, ViewChild} from '@angular/core';
import {ConceptService} from '../../concept.service';
import {TreeNode} from '../../models/TreeNode';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import {ActivatedRoute} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {Property} from '../../models/Property';
import {AuthenticationService} from '../../security/auth.service';
import {ConceptTreeViewComponent} from '../../components/concept-tree-view/concept-tree-view.component';

@Component({
  selector: 'app-data-model-library',
  templateUrl: './data-model-library.component.html',
  styleUrls: ['./data-model-library.component.scss']
})
export class DataModelLibraryComponent implements OnInit {
  concept: Concept;
  definition: Related[];
  properties: Property[];
  selectedNode: TreeNode;
  searchSize = 72;
  root = ':DM_DataModel';
  relationships = [':SN_116680003'];
  @ViewChild(ConceptTreeViewComponent, {static: true}) treeView: ConceptTreeViewComponent;

  constructor(private service: ConceptService,
              private auth: AuthenticationService,
              private route: ActivatedRoute,
              private log: LoggerService) {
  }

  ngOnInit() {
    // Direct URL nav - need to push to tree
    this.route.params.subscribe(
      (params) => this.treeView.loadTree((params.id) ? params.id : this.root)
    );
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  selectResult(item: any) {
    this.treeView.loadTree(item.iri);
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
    this.service.getConcept(node.id).subscribe(
      (result) => this.concept = result,
      (error) => this.log.error(error)
    );

    this.service.getDefinition(node.id).subscribe(
      (result) => this.definition = result,
      (error) => this.log.error(error)
    );

    this.service.getProperties(node.id).subscribe(
      (result) => this.properties = result,
      (error) => this.log.error(error)
    );
  }

  home() {
    window.open('#/mainPage', 'IMViewer_MainPage');
  }

  logout() {
    this.auth.logout();
  }
}
