import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import {NgEventBus} from 'ng-event-bus';
import {ConceptService} from '../../services/concept.service';
import {Concept} from '../../models/objectmodel/Concept';
import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {LoggerService} from '../../services/logger.service';
import {ConceptReference} from '../../models/objectmodel/ConceptReference';

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
  loadedChildren: string[] = [];

  constructor(private service: ConceptService,
              private log: LoggerService,
              private eventBus: NgEventBus) {
    this.dataSource.data = this.tree;
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // only create a new tree if one does not already exist
    if (this.tree.length == 0) {
      this.tree = [];
      if (this.parents) {
        this.addSelectedConceptToTree(this.parents);
        this.reverseTree(this.parents, 0, []);
      }
      this.tree.splice(1);
      this.dataSource.data = this.tree;
      this.treeControl.expandAll();
    }
  }

  // Required Methods
  _transformer = (node: ConceptNode, level: number) => {
    return {expandable: !!node.children && node.children.length > 0, name: node.name, iri: node.iri, level: level, children: node.children};
  }
  treeControl = new FlatTreeControl<ConceptNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ConceptNode) => node.expandable;

  // Add the currently selected Concept to the bottom of the tree
  addSelectedConceptToTree(conceptReferences: ConceptReferenceNode[]) {
    if (this.concept == null)
      return;

    let conceptReferenceNodes: ConceptReferenceNode[] = [];
    let conceptReferenceNode: ConceptReferenceNode = new ConceptReferenceNode();
    conceptReferenceNode.name = this.concept.name;
    conceptReferenceNode.iri = this.concept.iri;
    conceptReferenceNode.parents = conceptReferences;
    conceptReferenceNodes.push(conceptReferenceNode);
    this.parents = conceptReferenceNodes;
  }

  // Reverse the original parent hierarchy (parent -> child vs child -> parent)
  reverseTree(conceptReferences: ConceptReferenceNode[], level: number, previousNodes: ConceptNode[]): ConceptNode {
    let rootNode: ConceptNode;

    let nodes: ConceptNode[] = [];
    conceptReferences.forEach(conceptReference => {
      let node = {
        name: conceptReference.name,
        iri: conceptReference.iri,
        level: level,
        expandable: true,
        children: previousNodes,
      };
      // if this node is the currently selected concept, add its children
      if (node.iri === this.concept.iri) {
        node.children = this.addChildrenToTree();
      }
      nodes.push(node);
      // if this node is the root of the hierarchy, generate the tree
      if (conceptReference.parents.length === 0 || conceptReference.iri === this.root) {
        this.tree.push(node);
        rootNode = node;
      } else {
        this.reverseTree(conceptReference.parents, level, nodes);
      }
    });
    return rootNode;
  }

  // Add Children to the currently selected concept
  addChildrenToTree(): ConceptNode[] {
    let childNodes: ConceptNode[] = [];

    if (this.children) {
      this.children.forEach(child => {
        childNodes.push({
          name: child.name,
          iri: child.iri,
          level: 0,
          expandable: true,
          children: []
        });
      });
    }
    return childNodes;
  }

  selectNode(node) {
    this.eventBus.cast('app:conceptSelect', node.iri);
  }

  expandNode(node, isExpanded) {
    this.findAndExpandMatchingNode(node.iri, this.tree);
  }

  getExpansionIcon(node: ConceptNode): string {
    let expansionIcon: string;

    if (this.treeControl.isExpanded(node)) {
      if (node.expandable) {
        expansionIcon = 'expand_more';
      } else {
        if (this.loadedChildren.includes(node.iri)) {
          expansionIcon = 'remove';
        } else {
          expansionIcon = 'chevron_right';
        }
      }
    } else {
      if (node.expandable) {
        expansionIcon = 'expand_more';
      }
    }

    return expansionIcon;
  }

  findAndExpandMatchingNode(iri: string, nodes: ConceptNode[]) {
    nodes.forEach(node => {
      // expand Node
      if (node.iri === iri) {
        node.children = [];
        this.service.getConceptChildren(node.iri).subscribe(
          (result) => {
            this.addChildrenToParentNode(node, result);
            this.loadedChildren.push(node.iri)
          },
          (error) => {
            this.log.error(error);
          }
        );
      } else {
        this.findAndExpandMatchingNode(iri, node.children);
      }
    });
  }

  private addChildrenToParentNode(parentNode: ConceptNode, conceptChildren: ConceptReference[]) {
    if (conceptChildren != null && conceptChildren.length > 0) {
      parentNode.children = (conceptChildren.map<ConceptNode>(child => {
          return {
            name: child.name,
            iri: child.iri,
            level: parentNode.level + 1,
            expandable: false,
            children: [],
            childrenLoaded: false
          } as ConceptNode;
        })
      );

      parentNode.expandable = true;
      this.dataSource.data = this.tree;
      this.treeControl.expandAll();
    } else {
      parentNode.expandable = false;
      parentNode.children = [];
      this.dataSource.data = this.tree;
      this.treeControl.expandAll();
    }
  }

  // temp remove to avoid popout being triggered from nav.
  //<span (click)="selectNode(node)" (mouseenter)="nodeHover(node)" (mouseleave)="nodeHover(null)">{{node.name}}</span>
  // nodeHover(node: ConceptNode) {
  //   if (node !== null) {
  //     this.eventBus.cast('app:conceptHover', node.iri);
  //   } else {
  //     this.eventBus.cast('app:conceptHover', null);
  //   }
  // }

}
