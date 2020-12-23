import {ConceptReferenceNode} from '../../models/objectmodel/ConceptReferenceNode';
import {NgEventBus} from 'ng-event-bus';
import {ConceptService} from '../../services/concept.service';
import {Concept} from '../../models/objectmodel/Concept';
import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import { ActivatedRoute } from '@angular/router';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf, Subject, ReplaySubject, zip} from 'rxjs';
import {SelectionChange} from '@angular/cdk/collections';

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
  
  treeControl: NestedTreeControl<ConceptReferenceNode>;
  dataSource: MatTreeNestedDataSource<ConceptReferenceNode>;

  // it is very important that every node in the tree is registered in this map
  // and that when that node's children are changed that the associated Subject
  // is updated. This is the basis for the tree control being kept in sync with
  // the data
  childrenSubjects: Map<string, Subject<ConceptReferenceNode[]>> = new Map();
  dataChange: BehaviorSubject<ConceptReferenceNode[]> = new BehaviorSubject([]);

  selectedIri: string;

  constructor(private service: ConceptService,
              private log: LoggerService,
              private eventBus: NgEventBus,
              private route: ActivatedRoute,) {    
    this.treeControl = new NestedTreeControl<ConceptReferenceNode>(node => this.getChildrenObservable(node));
    this.dataSource = new MatTreeNestedDataSource<ConceptReferenceNode>();
    
    // when the tree has been changed (eg by fetching new children) this
    // data change is the way we tell the tree to re-draw
    this.dataChange.subscribe(data => this.dataSource.data = data);

    // handle expansion - may result in fetching children from the API
    // and incorporating them into the tree
    this.treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<ConceptReferenceNode>).added)  {
        this.onExpand(change.added);
      }
    });    
  }

  /************************  
   * Ng lifecycle methods *
   ************************/ 

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => this.selectedIri = (params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );

    // init the tree's data
    let selectedNode: ConceptReferenceNode = new ConceptReferenceNode();

    selectedNode.iri = this.concept.iri;
    selectedNode.name = this.concept.name;
    selectedNode.hasChildren = (this.children != null && this.children.length > 0);

    this.initTree(selectedNode, this.parents, this.children);

    let rootNode = this.getRootNode(selectedNode, this.root);
    
    // this populates the tree
    this.dataChange.next([rootNode]);

    // now we need to expand the selected node (and its parents)
    this.expand(selectedNode);
  }  

  /******************************************************************  
   * Mat Tree call back methods (see constructor and HTML template) *
   ******************************************************************/ 

  hasChild(_: number, node: ConceptReferenceNode): boolean {
    return node.hasChildren;
  }

  private getChildrenObservable(node: ConceptReferenceNode): Observable<ConceptReferenceNode[]> {
    let childrenSubject: Subject<ConceptReferenceNode[]> = this.childrenSubjects.get(node.iri);

    return childrenSubject;
  }

  /******************************************************  
   * Tree manipulation methods (select and expand node) *
   ******************************************************/  

  // attached to single click event (see HTML template)
  selectNode(node: ConceptReferenceNode):void {
    this.eventBus.cast('app:conceptSelect', node.iri);
  }

  // attached to double click event (see HTML template)
  expandNode(node: ConceptReferenceNode): void {
    this.initChildNodes(node);
  }

  highlightNode(node: ConceptReferenceNode): boolean {
    return this.selectedIri == node.iri;
  }

  isVisible(node: ConceptReferenceNode): boolean {
    return this.treeControl.isExpanded(node);
  }

  // used for manual-expansion of selected node (by user clicking expand icon: ">")
  private onExpand(nodesToExpand: ConceptReferenceNode[]) {
    nodesToExpand.forEach(nodeToExpand => this.initChildNodes(nodeToExpand));

    // TODO - put in loading logic progress bar
  }

  // fetch child nodes if necessary
  private initChildNodes(node: ConceptReferenceNode): void {
    if(node.hasChildren) {
      if(node.children == null || node.children.length == 0) {
        this.fetchChildren(node.iri).subscribe(
          result =>  { 
            this.initDecendants(node, result);
            this.dataChange.next(this.dataChange.value);
          },
          error => {
            this.log.error(error);
          }
        );
      }
    }
  }  

  // used for auto-expansion of selected node 
  // in this instance we have children locally
  private expand(node: ConceptReferenceNode): void {
    node.parents.forEach(parent => this.expand(parent))
    this.treeControl.expand(node);
  }

  private fetchChildren(iri: string): Observable<ConceptReferenceNode[]> {
    let children: Subject<ConceptReferenceNode[]> = new Subject();
    
    this.service.getConceptChildren(iri).subscribe(
      (result) => children.next(result),
      (error) => this.log.error(error)
    );    

    return children;
  }  
  

  /***************************************************************** 
   * Tree initialisation methods                                   *
   *                                                               *
   * These methods act to build and maintain the tree. They allow  *
   * new branches to be added to an existing tree (initDecendants) *
   * and well as creating a tree from scratch (initTree)           *
   *****************************************************************/

  private initTree(selectedNode: ConceptReferenceNode, parents: ConceptReferenceNode[], children: ConceptReferenceNode[]): void {
    // attach parents
    selectedNode.parents = parents;
    this.initAncestors(selectedNode, new Map());

    // attach children
    this.initDecendants(selectedNode, children);
  }

  private initAncestors(child: ConceptReferenceNode, allNodes: Map<string, ConceptReferenceNode>): void {
    
    if(child.parents != null) {
      child.parents.forEach(parent => {
        // we want the exact same node by Object reference, NOT by value equality
        if(allNodes.has(parent.iri) == false) {
          allNodes.set(parent.iri, parent);
          
          // we will need an initialised children array later on
          if(parent.children == null) {
            parent.children = [];
            this.registerChildrenObservable(parent);
          }
          
          // for debugging to help check we have unique nodes
          //parent.name = `(${Math.random()}) ${parent.name}`;
        }
        else {
          // this parent has been processed before we need to change the child's 
          // parent to point to this instance thus replacing the other instance  
          // that is equal by value but NOT by reference
           let parentIndex: number = child.parents.indexOf(parent);
           parent = allNodes.get(parent.iri);
           child.parents[parentIndex] = parent;
         }

        // only update the parent if it does not already contain the child
        if(parent.children.includes(child) == false) {
          parent.children.push(child);
          this.childrenSubjects.get(parent.iri).next(parent.children);

          // unwind up the hierarchy
          this.initAncestors(parent, allNodes);
        }
      })
    }
  }

  private initDecendants(node: ConceptReferenceNode, children: ConceptReferenceNode[]): void {
    // attach children
    this.registerChildrenObservable(node);
    node.children = children;
    
    if(node.children != null) {
      node.children.forEach(child => {
        child.parents = [node];
        this.registerChildrenObservable(child);
      });
    }
    
    // this must be done AFTER te child nodes have been registered
    this.childrenSubjects.get(node.iri).next(node.children);
  }

  private getRootNode(decendantNode: ConceptReferenceNode, rootIri: string): ConceptReferenceNode {
    let rootNode: ConceptReferenceNode = null;

    if(rootIri == decendantNode.iri) {
      rootNode = decendantNode;
    }

    while(rootNode == null && (decendantNode.parents != null && decendantNode.parents.length > 0)) {
      rootNode = decendantNode.parents.find(parent => rootIri == parent.iri)
        
      // just traversing one branch of inheritance should take us up to a 
      // common root ancestor
      decendantNode = decendantNode.parents[0];
    }

    if(rootNode == null) {
      this.log.error(`Unable to find root node with iri ${rootIri}`);
    }

    return rootNode;
  } 
  
  private registerChildrenObservable(node: ConceptReferenceNode) {
    if(this.childrenSubjects.has(node.iri) == false) {
      this.childrenSubjects.set(node.iri, new ReplaySubject());
    }
  }  
}
