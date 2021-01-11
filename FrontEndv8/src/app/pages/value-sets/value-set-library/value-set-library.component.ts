import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { SchemeCount } from '../../../models/old/SchemeCount';
import { ConceptService, ConceptAggregate } from '../../../services/concept.service';
import { Concept } from '../../../models/objectmodel/Concept';
import { ConceptType } from '../../../models/objectmodel/ConceptType';
import { ConceptReference } from '../../../models/objectmodel/ConceptReference';
import { NgEventBus } from 'ng-event-bus';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {  BehaviorSubject, Observable, Subject, forkJoin, ReplaySubject } from 'rxjs';
import { ClassExpression } from 'src/app/models/objectmodel/ClassExpression';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {PageEvent} from '@angular/material/paginator';
import {LoggerService} from '../../../services/logger.service';
import {Perspectives} from '../../../services/perspective.service';
import { ConceptView, HistoryItem } from '../../../common/ConceptView';
import { valueSetServiceProvider } from '../../../services/valueset.service.provider';
import { ValueSetService, ValueSet } from '../../../services/valueset.service';
import { ConceptHierarchyViewComponent } from 'src/app/components/concept-hierarchy-view/concept-hierarchy-view.component';
import { ValueSetTree } from './ValueSetTree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { SummaryDrawerComponent } from '../../../components/summary-drawer/summary-drawer.component';
import { ConceptTreeController } from '../../../common/ConceptTreeController';

@Component({
  selector: 'app-value-set-library',
  templateUrl: './value-set-library.component.html',
  styleUrls: ['./value-set-library.component.scss'],
  providers: [ valueSetServiceProvider ],
})
export class ValueSetLibraryComponent implements OnInit {
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;

  selectedConcept: Concept;

  //valueSetTree: ValueSetTree;

  treeController: ConceptTreeController;


  conceptView: ConceptView;

  searchSize = 72;

  relationships = ['sn:116680003'];
  nameCache = {};
  hoveredConcept: Concept = new Concept();
  history = [];
  timer: any;
  sidebar = false;

  @ViewChild(SummaryDrawerComponent, { static: true }) summaryDrawer: SummaryDrawerComponent;

  constructor(private service: ConceptService,
              private valueSetService: ValueSetService,
              public perspectives: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private dialog: MatDialog,
              private eventBus: NgEventBus) {

    this.conceptView = new ConceptView(service, perspectives, log, router, route, perspectives.valueSets);
    this.conceptView.onNavigationStart(this.onConceptAggregateChange.bind(this), this.onError.bind(this) )
    this.conceptView.onNavigationEnd(this.onHistoryChange.bind(this), this.onError.bind(this) )

    // this.valueSetTree = new ValueSetTree(service, log, eventBus);
    // eventBus.on(ValueSetTree.NODE_SELECTED_EVENT).subscribe((iri: string) => {
    //   this.showSummaryDrawer(iri);
    // });

    this.treeController = new ConceptTreeController(service, log, eventBus);
    eventBus.on(ConceptTreeController.NODE_SELECTED_EVENT).subscribe((iri: string) => {
      this.showSummaryDrawer(iri);
    });    
  }

  // goto(iri: string) {
  //   if (iri !== this.selectedIri) {	    if (iri !== this.selectedIri) {
  //     this.router.navigate(['valueSets', iri]);	      this.router.navigate([this.perspectives.valueSets.primary.state, iri]);
  //   }	    
  // }	  


  //  gotoConcept(iri: string) {
  //   this.router.navigate(['ontology', iri]);	    this.router.navigate([this.perspectives.ontology.primary.state, iri]);
  // }	  
  
  ngOnInit() {
    this.conceptView.init();
  }

  get selectedIri() {
    return this.concept.iri;
  }  

  // get treeControl(): NestedTreeControl<ConceptReferenceNode> {
  //   return this.treeController.treeControl;
  //   //return this.valueSetTree.treeControl;
  // }

  // get treeDataSource(): MatTreeNestedDataSource<ConceptReferenceNode> {
  //   return this.treeController.dataSource;
  //   //return this.valueSetTree.dataSource;
  // }

  get showTree() {
    return this.treeController.isViewable;
    //return this.valueSetTree.isViewable;
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if(conceptAggregate != null) {
      // need to check if it's a valuset
      if(this.valueSetService.isValueSet(conceptAggregate.concept)) {
        this.concept = conceptAggregate.concept;
        this.children = conceptAggregate.children;
        this.parents = conceptAggregate.parents;
        
        let valueSet: ValueSet = this.valueSetService.toValueSet(this.concept);
        this.initTree(valueSet);
      }
      else {
        // error time
      }
    }
    else {
      this.log.debug("onConceptAggregateChange - ConceptAggregate is null");
    }
  }

  private onHistoryChange(history: Array<HistoryItem>): void {
    this.history = history;
  }

  private onError(error: any): void {
    this.log.error(error);
  } 

  private showSummaryDrawer(iri: string) {
    const root = this;
    if (iri != null) {
      this.service.getConcept(iri).subscribe(
        (concept) => {
          this.selectedConcept = concept,
          this.summaryDrawer.open();
        },
        (error) => this.onError(error)
      );
    }
  }
  
  private initTree(valueSet: ValueSet) {
      // need to build up the children
      forkJoin([this.initNode("included", valueSet.included), this.initNode("excluded", valueSet.excluded)]).subscribe(
        ([included, excluded]) => {

          // add some dummy children to excluded
          // excluded.children.push(this.toConceptReferenceNode("test1", "test1"));
          // excluded.children.push(this.toConceptReferenceNode("test2", "test2"));
          // excluded.hasChildren = true;

          let tree: ConceptReferenceNode = this.toConceptReferenceNode(this.concept.iri, this.concept.name, [included, excluded]);
          this.treeController.setDataAndSelectedNode(tree, included);

          //this.valueSetTree.init(tree, included.iri);
          
        },
      (error) => { 
        this.log.error(error); 
      }
    );
  }

  private getChildren(parents: ConceptReferenceNode[]): Observable<ConceptReferenceNode[][]> {
    const getGrandChildrenRequests: Observable<ConceptReferenceNode[]>[] = parents.map(parent => { 
      return this.service.getConceptChildren(parent.iri) 
    });

    return forkJoin(getGrandChildrenRequests);
  }

  private initNode(name: string, childRefs: ConceptReference[] = []): Observable<ConceptReferenceNode> {
    let nodeObservable: Subject<ConceptReferenceNode> = new ReplaySubject();
    
    let node: ConceptReferenceNode = this.toConceptReferenceNode("app-value-set-library-" + name, name);
    
    if(childRefs != null && childRefs.length > 0) {    
      let childNodes: ConceptReferenceNode[] = childRefs.map(child => this.toConceptReferenceNode(child.iri, child.name));
      node.children = childNodes;
      node.hasChildren = true;

      this.getChildren(childNodes).subscribe(
        success => {
          let index: number = 0;

          success.forEach(response => {
            childNodes[index++].hasChildren = response.length > 0;
          })

          nodeObservable.next(node);
          nodeObservable.complete();
        },
        error => { 
          this.log.error(error); 
        }
      );
    }
    else {
      nodeObservable.next(node);
      nodeObservable.complete();
    }
  
    return nodeObservable;
  }

  private toConceptReferenceNode(iri: string, name: string, children: ConceptReferenceNode[] = []): ConceptReferenceNode {
    let node: ConceptReferenceNode = new ConceptReferenceNode();
    node.iri = iri
    node.name = name;
    node.hasChildren = children.length > 0;
    node.children = children;

    return node;
  }
}


