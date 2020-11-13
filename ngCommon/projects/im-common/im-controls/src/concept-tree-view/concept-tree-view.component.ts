import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {TreeNode} from '../models/old/TreeNode';
import {TreeSource} from './TreeSource';
import {LoggerService} from 'dds-angular8/logger';
import {Clazz} from '../models/objectmodel/Clazz';
import {Related} from '../models/old/Related';
import {ConceptTreeViewService} from './concept-tree-view.service';
import { NgEventBus } from 'ng-event-bus';

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
  selectedIri: string;
  treeControl: FlatTreeControl<TreeNode>;
  dataSource: TreeSource;
  relationships = ['sn:116680003'];

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => node.expandable;
  hasChild = (_: number, nodeData: TreeNode) => nodeData.expandable;

  constructor(private service: ConceptTreeViewService,
              private log: LoggerService,
              private eventBus: NgEventBus) {
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
      this.eventBus.cast('app:conceptSelect', node.id);
    }
  }

  nodeHover(node: TreeNode) {
    if (node !== null) {
      const concept: Clazz = new Clazz();
      concept.name = node.name;
      concept.iri = node.id;
      this.eventBus.cast('app:conceptHover', concept);
    } else {
      this.eventBus.cast('app:conceptHover', null);
    }
  }

  loadConceptTree(concept: Clazz) {
    this.service.loadTree(this.root, concept.iri, this.relationships).subscribe(
      (result) => this.buildTree(concept, result),
      (error) => this.log.error(error)
    );
  }

  buildTree(concept: Clazz, related: Related[]) {

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
