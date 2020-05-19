import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {TreeNode} from '../../models/TreeNode';
import {TreeSource} from './TreeSource';
import {LoggerService} from 'dds-angular8/logger';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import {ConceptService} from '../../concept.service';

@Component({
  selector: 'app-concept-tree-view',
  templateUrl: './concept-tree-view.component.html',
  styleUrls: ['./concept-tree-view.component.scss']
})
export class ConceptTreeViewComponent implements OnInit {
  @Input()  root: string;
  @Output() selection: EventEmitter<any> = new EventEmitter<any>();


  treeControl: FlatTreeControl<TreeNode>;
  dataSource: TreeSource;
  selectedNode: TreeNode;
  relationships = [':SN_116680003'];

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => node.expandable;
  hasChild = (_: number, nodeData: TreeNode) => nodeData.expandable;

  constructor(private service: ConceptService,
              private log: LoggerService) {
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new TreeSource(this.treeControl, service, log, this.relationships);
  }

  ngOnInit() {
  }

  loadTree(id: string) {
    if (id) {
      this.service.getConcept(id).subscribe(
        (result) => this.showConceptTree(result),
        (error) => this.log.error(error)
      );
    } else if (this.root) {
      this.service.getConcept(this.root).subscribe(
        (result) => this.dataSource.data = [new TreeNode(result.iri, result.name, 0, true)],
        (error) => this.log.error(error)
      );
    }
  }

  showConceptTree(concept: Concept) {
    this.service.loadTree(this.root, concept.iri, this.relationships).subscribe(
      (result) => this.buildTree(concept, result),
      (error) => this.log.error(error)
    );
  }

  buildTree(concept: Concept, related: Related[]) {
    let i = 0;

    const node: TreeNode = new TreeNode(concept.iri, concept.name, related.length, true);

    related.reverse();

    this.dataSource.data =
      related
        .map(r => new TreeNode(r.concept.iri, r.concept.name, i++, true))
        .concat(node);

    this.selectNode(node);
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
    this.selection.emit(node);
  }

}
