import { ConceptReferenceNode } from './../../models/objectmodel/ConceptReferenceNode';
import { LoggerService } from 'dds-angular8';
import { NgEventBus } from 'ng-event-bus';
import { ConceptService } from './../../services/concept.service';
import { Concept } from './../../models/objectmodel/Concept';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';




interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

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

  ngOnChanges(changes: SimpleChanges): void {
    this.tree = [];
    this.addConceptandChildrenToTree(this.parents);
    this.reverseTree(this.parents, 0, []);
    this.dataSource.data = this.tree;

    this.treeControl.expandAll();
  }

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
      nodes.push(node);
      if(conceptReference.parents.length === 0) {
        this.tree.push(node);
      }
      this.reverseTree(conceptReference.parents, level, nodes);
    });
    return nodes;
  }

  addConceptandChildrenToTree(conceptReferences: ConceptReferenceNode[]) {
    let conceptReferenceNodes : ConceptReferenceNode[] = [];
    let conceptReferenceNode: ConceptReferenceNode = new ConceptReferenceNode();
    conceptReferenceNode.name = this.concept.name;
    conceptReferenceNode.iri = this.concept.iri;
    conceptReferenceNode.parents = conceptReferences;
    conceptReferenceNodes.push(conceptReferenceNode);
    this.parents = conceptReferenceNodes;
  }

  _transformer = (node: ConceptNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      iri: node.iri,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ConceptNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ConceptNode) => node.expandable;

  selectNode(node) {
    this.eventBus.cast('app:conceptSelect', node.iri);
  }

  nodeHover(node: ConceptNode) {
    if (node !== null) {
      const concept: Concept = new Concept();
      concept.name = node.name;
      concept.iri = node.iri;
      this.eventBus.cast('app:conceptHover', concept);
    } else {
      this.eventBus.cast('app:conceptHover', null);
    }
  }

}
