import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {TreeNode} from '../models/TreeNode';
import {TreeSource} from './TreeSource';
import {LoggerService} from 'dds-angular8/logger';
import {Concept} from '../models/Concept';
import {Related} from '../models/Related';
import {ConceptTreeViewService} from './concept-tree-view.service';

@Component({
  selector: 'app-concept-tree-view',
  templateUrl: './concept-tree-view.component.html',
  styleUrls: ['./concept-tree-view.component.scss']
})
export class ConceptTreeViewComponent implements AfterViewInit {
  @Input()  root: string;
  @Input()
  set conceptIri(iri: string) {
    this.displayNode(iri);
  }
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();
  @Output() hover = new EventEmitter<Concept>();


  selectedIri: string;
  treeControl: FlatTreeControl<TreeNode>;
  dataSource: TreeSource;
  relationships = ['sn:116680003'];

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => node.expandable;
  hasChild = (_: number, nodeData: TreeNode) => nodeData.expandable;

  constructor(private service: ConceptTreeViewService,
              private log: LoggerService) {
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new TreeSource(this.treeControl, service, log, this.relationships);
  }

  ngAfterViewInit() {
    this.selectedIri = this.root;
/*    this.service.getConcept(this.root).subscribe(
      (result) => this.dataSource.data = [new TreeNode(result.iri, result.name, 0, true)],
      (error) => this.log.error(error)
    );*/
  }

  displayNode(id: string) {
    if (id !== this.selectedIri) {
      this.selectedIri = id;

      if (id) {
        // Load clean tree if selection not currently loaded
        if (this.dataSource.data.findIndex((v) => v.id === id) === -1) {
          this.service.getConcept(id).subscribe(
            (result) => this.loadConceptTree(result),
            (error) => this.log.error(error)
          );
        }
      }
    }
  }

  selectNode(node: TreeNode) {
    if(node.level === 0) {
      this.dataSource.toggleNode(node, true);
    }
    if (node.id === '_LOADMORE_') {
      node.name = 'Loading...';
      this.dataSource.toggleNode(node, true);
    } else {
      this.selectedIri = node.id;
      this.selection.emit(node.id);
    }
  }

  nodeHover(node: TreeNode) {
    if (node != null || node !== undefined) {
      this.service.getConcept(node.id).subscribe(
        (result) => this.hover.emit(result),
        (error) => this.log.error(error)
      );
    } else {
      this.hover.emit({
        name: '',
        description: '',
        iri: ''
      });
    }
  }

  loadConceptTree(concept: Concept) {
    this.service.loadTree(this.root, concept.iri, this.relationships).subscribe(
      (result) => this.buildTree(concept, result),
      (error) => this.log.error(error)
    );
  }

  buildTree(concept: Concept, related: Related[]) {

    related.reverse();

    const nodes: TreeNode[] = [];
    let parent: TreeNode = null;
    for (let i = 0; i < related.length; i++) {
      const r = related[i];
      const node = new TreeNode(r.concept.iri, r.concept.name, i, true, parent);
      nodes.push(node);
      parent = node;
    }
    const conceptNode = new TreeNode(concept.iri, concept.name, related.length, true, parent);
    nodes.push(conceptNode);


    this.dataSource.data = nodes;

    this.selectNode(conceptNode);
  }

  getNodeIcon(node: any) {
    // node.expandable ? (treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right') : 'remove'
    if (node.expandable) {
      return this.treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right';
    } else {
      return (node.id === '_LOADMORE_') ? '' : 'remove';
    }
  }
}
