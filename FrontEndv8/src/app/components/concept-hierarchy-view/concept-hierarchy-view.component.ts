import { ConceptReferenceNode } from './../../models/objectmodel/ConceptReferenceNode';
import { LoggerService } from 'dds-angular8';
import { NgEventBus } from 'ng-event-bus';
import { ConceptService } from './../../services/concept.service';
import { Concept } from './../../models/objectmodel/Concept';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface ConceptNode {
  name: string;
  iri: string;
  level: number;
  expandable: boolean;
  children?: ConceptNode[];
}

@Component({
  selector: 'app-concept-hierarchy-view',
  templateUrl: './concept-hierarchy-view.component.html',
  styleUrls: ['./concept-hierarchy-view.component.scss']
})

export class ConceptHierarchyViewComponent implements OnInit {

  @Input() root: string;
  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;

  tree: ConceptNode[] = [];

  constructor(private service: ConceptService,
    private log: LoggerService,
    private eventBus: NgEventBus) {
    this.dataSource.data = this.tree;
  }

  ngOnInit() {

  }

  // TODO If the has not been loaded, generate a new tree
  ngOnChanges(changes: SimpleChanges): void {
    this.tree = [];
    this.addSelectedConceptToTree(this.parents);
    this.reverseTree(this.parents, 0, []);
    this.tree.splice(1);
    this.dataSource.data = this.tree;
    this.treeControl.expandAll();
  }

  // Required Methods
  _transformer = (node: ConceptNode, level: number) => { return { expandable: !!node.children && node.children.length > 0, name: node.name, iri: node.iri, level: level, };}
  treeControl = new FlatTreeControl<ConceptNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ConceptNode) => node.expandable;

  // Add the currently selected Concept to the bottom of the tree
  addSelectedConceptToTree(conceptReferences: ConceptReferenceNode[]) {
    let conceptReferenceNodes: ConceptReferenceNode[] = [];
    let conceptReferenceNode: ConceptReferenceNode = new ConceptReferenceNode();
    conceptReferenceNode.name = this.concept.name;
    conceptReferenceNode.iri = this.concept.iri;
    conceptReferenceNode.parents = conceptReferences;
    conceptReferenceNodes.push(conceptReferenceNode);
    this.parents = conceptReferenceNodes;
  }

  // Reverse the original parent hierarchy (parent -> child vs child -> parent)
  reverseTree(conceptReferences: ConceptReferenceNode[], level: number, previousNodes: ConceptNode[]): ConceptNode[] {
    let nodes: ConceptNode[] = [];
    conceptReferences.forEach(conceptReference => {
      let node = {
        name: conceptReference.name,
        iri: conceptReference.iri,
        level: level,
        expandable: true,
        children: previousNodes
      };
      // if this node is the currently selected concept, add its children
      if (node.iri === this.concept.iri) {
        node.children = this.addChildrenToTree();
      }
      nodes.push(node);
      // if this node is the root of the hierarchy, generate the tree
      if (conceptReference.parents.length === 0 || conceptReference.iri === this.root) {
        this.tree.push(node);
      } else {
        this.reverseTree(conceptReference.parents, level, nodes);
      }
    });
    return nodes;
  }

  // Add Children to the currently selected concept
  addChildrenToTree(): ConceptNode[] {
    let childNodes: ConceptNode[] = [];
    this.children.forEach(child => {
      childNodes.push({
        name: child.name,
        iri: child.iri,
        level: 0,
        expandable: true,
        children: []
      });
    });
    return childNodes;
  }

  selectNode(node) {
    this.eventBus.cast('app:conceptSelect', node.iri);
  }

  expandNode(node, isExpanded) {
    this.findAndExpandMatchingNode(node.iri, this.tree);
  }

  findAndExpandMatchingNode(iri: string, nodes: ConceptNode[]) {
    nodes.forEach(node => {
      // expand Node
      if (node.iri === iri) {
        node.children = [];
        this.service.getConceptChildren(node.iri).subscribe(
          (result) => result.forEach(child => {
            node.children.push({
              name: child.name,
              iri: child.iri,
              level: node.level + 1,
              expandable: false,
              children: []
            });
            this.dataSource.data = this.tree;
            this.treeControl.expandAll();
          }),
          (error) => { this.log.error(error); }
        );
      } else {
        this.findAndExpandMatchingNode(iri, node.children);
      }
    });
  }

  nodeHover(node: ConceptNode) {
    if (node !== null) {
      this.eventBus.cast('app:conceptHover', node.iri);
    } else {
      this.eventBus.cast('app:conceptHover', null);
    }
  }

}
