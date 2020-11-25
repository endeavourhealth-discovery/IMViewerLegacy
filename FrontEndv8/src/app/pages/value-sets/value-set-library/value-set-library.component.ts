import { ConceptReferenceNode } from './../../../models/objectmodel/ConceptReferenceNode';
import { ConceptTreeViewComponent } from 'im-common/im-controls';
import { SchemeCount } from './../../../models/old/SchemeCount';
import { ConceptService } from './../../../services/concept.service';
import { Concept } from './../../../models/objectmodel/Concept';
import { ConceptType } from './../../../models/objectmodel/ConceptType';
import { ConceptReference } from './../../../models/objectmodel/ConceptReference';
import { NgEventBus } from 'ng-event-bus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { LoggerService } from 'dds-angular8/logger';
import { MatDialog } from '@angular/material/dialog';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin, BehaviorSubject, Observable, of as observableOf, merge, Subject, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClassExpression } from 'src/app/models/objectmodel/ClassExpression';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';

@Component({
  selector: 'app-value-set-library',
  templateUrl: './value-set-library.component.html',
  styleUrls: ['./value-set-library.component.scss']
})
export class ValueSetLibraryComponent implements OnInit {
  valueSetPerspective: ValueSetPersepctive;
  conceptTree: ConceptTree;
  
  isValueSetAvailable: boolean;

  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;

  selectedIri: string;
  searchSize = 72;
  root = ':VSET_ValueSet';
  relationships = ['sn:116680003'];
  nameCache = {};
  hoveredConcept: Concept = new Concept();
  history = [];
  timer: any;
  sidebar = false;
  @ViewChild(ConceptTreeViewComponent, { static: true }) treeView: ConceptTreeViewComponent;

  constructor(private service: ConceptService,
              private auth: KeycloakService,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private dialog: MatDialog,
              private eventBus: NgEventBus) {
    
    this.routeEvent(this.router);

    this.conceptTree = new ConceptTree(service);

    this.eventBus.on('app:conceptHover').subscribe((iri: string) => {
      this.itemHover(iri);
    });
  }

  onMemberSelected(member: ConceptReference): void {
    // need to get the children from the valueset
    console.log('onMemberSelected ->', JSON.stringify(member));
    this.conceptTree.initialise(member);
  }

  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd && this.concept !== undefined) {
        this.history.unshift(
          {
            url: e.url,
            concept: this.concept
          }
        );
      }
    });
  }

  ngOnInit() {
    // Direct URL nav - need to push to tree
    this.route.queryParamMap.subscribe(
      (params) => this.displayConcept(params.get('id') ? params.get('id') : this.root),
      (error) => this.log.error(error)
    );


  }

  displayConcept(iri: string) {
    if (this.selectedIri !== iri) {
      this.nameCache = {};
      this.selectedIri = iri;
      this.service.getConcept(iri).subscribe(
        (result) => { 
          this.concept = result, 
          this.valueSetPerspective = new ValueSetPersepctive(result); 
          this.isValueSetAvailable = true 
          this.conceptTree.clear();
        },
        (error) => this.log.error(error)
      );
      this.service.getConceptChildren(iri).subscribe(
        (result) => this.children = result,
        (error) => { this.log.error(error); }
      );

      this.service.getConceptParents(iri).subscribe(
        (result) => this.parents = result,
        (error) => { this.log.error(error); }
      );
    }
  }

  getMembers(): ConceptReference[] {
    return this.valueSetPerspective.members;
  }

  get nonMembers(): ConceptReference[] {
    return this.valueSetPerspective.nonMembers;
  }

  getJson(object: any) {
    return JSON.stringify(object);
  }

  itemHover(iri: string) {
    const root = this;
    if (iri != null) {
      this.timer = setTimeout(() => {
        root.sidebar = true;
      }, 1000);
      this.service.getConcept(iri).subscribe(
        (result) => this.hoveredConcept = result,
        (error) => this.log.error(error)
      );
    } else {
      clearTimeout(this.timer);
    }
  }

  sumCounts(counts: SchemeCount[]) {
    if (!counts)
      return 0;

    let total = 0;
    for (let c of counts)
      total += c.count;

    return total;
  }

  // expand(item: ValueSetMember) {
  //   if (item && !item.counts) {
  //   }
  // }

  goto(iri: string) {
    if (iri !== this.selectedIri) {
      this.router.navigate(['valueSets'], { queryParams: { id: iri } });
    }
  }

  gotoConcept(iri: string) {
    console.log("gotoConcept > " + iri);
    this.router.navigate(['ontology'], { queryParams: { id: iri } });
  }

  hasResults(displayed: boolean) {
    this.searchSize = displayed ? 256 : 72;
  }

  // viewChildren(item: ValueSetMember, scheme?: string) {
  //   console.log('Viewing children of ' + item.iri + ' (scheme ' + scheme + ')');
  //   MemberDialogComponent.open(this.dialog, item.iri, scheme).subscribe();
  // }

  getCode(iri: string) {
    return iri.substring(iri.indexOf('_') + 1);
  }

  logout() {
    this.auth.logout();
  } 

  get hasMembers(): boolean {
    return this.valueSetPerspective.containsMembers();
  }

  get hasChildren(): boolean {
    return this.valueSetPerspective.containsMembers();
  }
}

class ConceptNodeStore {

  dataObservable: BehaviorSubject<ConceptNode[]>
  conceptNodeCache: Map<string, ConceptNode>

  getChildrenRequest = (parentIri: string) => this.conceptService.getConceptChildren(parentIri);

  constructor(private conceptService: ConceptService) {
    this.dataObservable = new BehaviorSubject<ConceptNode[]>([]);
    this.conceptNodeCache = new Map<string, ConceptNode>();
  }

  clear(): void {
    this.dataObservable.next([]);
  }

  store(node: ConceptNode): void {
    this.getChildrenOfConceptNode(node).subscribe(
      children => { 
        // cache the children
        children.forEach(child => this.conceptNodeCache.set(child.iri, child));
        
        this.dataObservable.next(children);
      }
    );
  }

  loadChildren(iri: string): ConceptNode {
    let parent: ConceptNode = this.conceptNodeCache.get(iri);
    if(parent != null) {
      if(parent.childrenLoaded == false) {
        this.getChildrenOfConceptNode(parent).subscribe(
          children => {
            this.handleChildren(children, parent);
          }
        );
      }
      else {
        // todo - do we need to do this?
        parent.childrenObservable.next(parent.childrenObservable.value);        
        this.dataObservable.next(this.dataObservable.value);      
      }
    }
    else {
      console.log("ConceptTree.loadChildren could not find cachec ConceptNode for iri ", iri);
    }

    return parent;
  }

  private handleChildren(children: ConceptNode[], parent: ConceptNode): void {
    children.forEach(child => this.conceptNodeCache.set(child.iri, child));
            
    parent.childrenObservable.next(children);
    parent.childrenLoaded = true;
    
    this.dataObservable.next(this.dataObservable.value);
  }

  private getChildrenOfConceptNode(parent: ConceptNode): Observable<ConceptNode[]> {
    let childrenObservable = new Subject<ConceptNode[]>();

    this.getChildrenByIri(parent.iri).subscribe(
      children => {
        // load grand children in the background
        children.forEach(child => {
          this.getChildrenByIri(child.iri).subscribe(
            grandChildren => this.handleChildren(grandChildren, child)
          );
        })  
        
        // direct children are ready now that grandchildren are done
        childrenObservable.next(children);
      }
    );
  
    return childrenObservable;
  }

  // TODO - this method contains hacks to generate test data
  private getChildrenByIri(iri: string): Observable<ConceptNode[]> {
    let childrenObservable = new Subject<ConceptNode[]>();
    
    this.getChildrenRequest(iri).subscribe( // hack as we know this has children
      children => { 
        let childNodes: ConceptNode[] = [];

        children.forEach(child => {  
          let childNode = new ConceptNode(child.iri);
          childNode.name = child.name
          childNodes.push(childNode);
        })

        childrenObservable.next(childNodes);
      }
    );  

    return childrenObservable;
  }
  
}

class ConceptTree {

  dataStore: ConceptNodeStore;
  control: FlatTreeControl<FlatConceptNode>; 
  dataSource: MatTreeFlatDataSource<ConceptNode, FlatConceptNode>;
  flattener: MatTreeFlattener<ConceptNode, FlatConceptNode>
  nodeCache: Map<string, FlatConceptNode>;
  selectionHasChildren: Subject<boolean>;

  constructor(private conceptService: ConceptService) {
    this.nodeCache = new Map<string, FlatConceptNode>();
    this.dataStore = new ConceptNodeStore(conceptService);
    this.control = new FlatTreeControl<FlatConceptNode>(this.getLevel, this.isExpandable);
    this.flattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren)
    this.dataSource = new MatTreeFlatDataSource(this.control, this.flattener);
    this.selectionHasChildren = new Subject<boolean>();

    this.dataStore.dataObservable.subscribe(
      data => this.dataSource.data = data
    );
  }

  getChildren = (node: ConceptNode): Observable<ConceptNode[]> => node.childrenObservable;

  getLevel = (node: FlatConceptNode) => node.level;

  isExpandable = (node: FlatConceptNode) => true;//node.expandable; <--- TODO here's the issue

  transformer = (node: ConceptNode, level: number): FlatConceptNode => {
    let flatNode = this.nodeCache.get(node.iri);
   
    if(flatNode == null) {
      flatNode = {
        expandable: node.expandable,
        name: node.name,
        iri: node.iri,
        level: level,
      };

      this.nodeCache.set(flatNode.iri, flatNode);
    }
    
    return flatNode;
  }

  clear(): void {
    this.dataStore.clear();
  }

  initialise(conceptReference: ConceptReference): void {
    let conceptNode = new ConceptNode(conceptReference.iri);
    conceptNode.name = conceptReference.name;

    this.dataStore.store(conceptNode);
  }

  loadChildren(flatNode: FlatConceptNode): void {
    this.dataStore.loadChildren(flatNode.iri).childrenObservable.subscribe(
      children => {
        this.selectionHasChildren.next(children != null && children.length > 0);
      }
    );
  }
}

class ConceptNode {
  name: string;
  childrenLoaded: boolean;
  childrenObservable: BehaviorSubject<ConceptNode[]>;

  constructor(public iri: string) {
    this.childrenObservable = new BehaviorSubject<ConceptNode[]>([]);
    this.childrenLoaded = false;
  }

  get expandable(): boolean {
    return this.childrenLoaded && this.childrenObservable.value.length > 0;
  }
}

interface FlatConceptNode {
  expandable: boolean;
  iri: string;
  name: string;
  level: number;
}

class ValueSetPersepctive {

  members: ConceptReference[];
  nonMembers: ConceptReference[];
  
  constructor(private concept: Concept) {
    this.members = [];
    this.nonMembers = [];
    
    if(ConceptType.Class === concept.conceptType) {          
      this.processSubClass(concept);
    }
    else {
      console.log("Concept's type is not ", ConceptType.Class.valueOf, concept.conceptType);
    }
  }

  containsMembers(): boolean {
    return this.members.length > 0 || this.nonMembers.length > 0;
  }

  private processSubClass(concept: Concept): void {

    for (let intersection of concept.SubClassOf[0].Intersection) {    
      let objectPropertyValue = intersection.ObjectPropertyValue;

      if(objectPropertyValue != null && this.hasMembers(objectPropertyValue.Property)) {        
        this.processMembersExpression(objectPropertyValue.Expression, true);  
      }
      else {
        console.log("Concept intersection has no members - ", JSON.stringify(intersection));
      }
    }
  }

  // TODO - remove hardcoding - can the IRI be config?
  private hasMembers(property: ConceptReference): boolean {
    return ":hasMembers" == property.iri;
  } 
  
  private processMembersExpression(membersExpression: ClassExpression, definesMembers: boolean): void {
    console.log("processMembersExpression");
    
    if(membersExpression != null) {
      // check if it's a union, intersection or a complement
      if(membersExpression.Union != null && membersExpression.Union.length > 0) {
        membersExpression.Union.forEach(classExpression => {
          this.processMembersExpression(classExpression, definesMembers);
        });
      }
      else if(membersExpression.Intersection != null && membersExpression.Intersection.length > 0) {
        membersExpression.Intersection.forEach(classExpression => {
          this.processMembersExpression(classExpression, definesMembers);
        });
      }
      else if(membersExpression.ComplementOf != null) {
        // will prob be a Union inside
        // assume everything under here is to be excluded
        this.processMembersExpression(membersExpression.ComplementOf, !definesMembers) 
      }
      else {
        this.classify(membersExpression.Class, definesMembers);
      } 
    }
    else {
      console.log("processMembersExpression - membersExpression param is null");
    }
  } 
  
  private classify(conceptReference: ConceptReference, isMember: boolean): void {
    console.log("classify ", JSON.stringify(conceptReference));
    
    if(isMember) {
      this.members.push(conceptReference);
    }
    else {
      this.nonMembers.push(conceptReference);
    }
  }
}