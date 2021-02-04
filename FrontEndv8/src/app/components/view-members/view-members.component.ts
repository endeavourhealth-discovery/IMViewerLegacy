import { valueSetServiceProvider } from './../../services/valueset.service.provider';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { ConceptTreeController, ConceptTreeSelection } from './../../common/ConceptTreeController';
import { ConceptView} from './../../common/ConceptView';
import { Concept } from './../../models/objectmodel/Concept';
import { ConceptReference } from './../../models/objectmodel/ConceptReference';
import { ConceptReferenceNode } from './../../models/objectmodel/ConceptReferenceNode';
import { ConceptService } from './../../services/concept.service';
import { LoggerService } from './../../services/logger.service';
import { Perspectives } from './../../services/perspective.service';
import { ValueSet, ValueSetService } from './../../services/valueset.service';

@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.scss'],
  providers: [ valueSetServiceProvider ]
})
export class ViewMembersComponent implements OnInit {

  @Input() concept: Concept;
  @Input() parents: Array<ConceptReferenceNode>;
  @Input() children: Array<ConceptReferenceNode>;
  selectedConcept: Concept;
  treeController: ConceptTreeController;
  conceptView: ConceptView;
  relationships = ['sn:116680003'];
  busy = false;

  constructor(private service: ConceptService,
    private valueSetService: ValueSetService,
    public perspectives: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private dialog: MatDialog,
    private eventBus: NgEventBus) {

      this.treeController = new ConceptTreeController(service, log, eventBus);
      eventBus.on(ConceptTreeController.NODE_SELECTED_EVENT).subscribe((selectionEvent: ConceptTreeSelection) => {
        this.showSummaryDrawer(selectionEvent.iri);
      });
    }

    get selectedIri() {
      return this.concept.iri;
    }

    get showTree() {
      return this.treeController.isViewable;
    }

  ngOnInit() {

  }

  ngOnChanges(): void {
    let valueSet: ValueSet = this.valueSetService.toValueSet(this.concept);
    this.initTree(valueSet);
  }

  private onError(error: any): void {
    this.log.error(error);
  }

  private showSummaryDrawer(iri: string) {

    this.eventBus.cast('app:conceptSummary', iri);


    // const root = this;
    // if (iri != null) {
    //   this.service.getConcept(iri).subscribe(
    //     (concept) => {
    //       this.selectedConcept = concept
    //     },
    //     (error) => this.onError(error)
    //   );
    // }
  }

  private initTree(valueSet: ValueSet) {
    this.busy = true;
      // need to build up the children
      forkJoin([this.initNode("Included", valueSet.included), this.initNode("Excluded", valueSet.excluded)]).subscribe(
        ([included, excluded]) => {
          this.busy = false;
          let tree: ConceptReferenceNode = this.toConceptReferenceNode(this.concept.iri, this.concept.name, [included, excluded]);
          this.treeController.setDataAndSelectedNode(tree, included);
        },
      (error) => {
        this.busy = false;
        this.log.error(error);
      }
    );
  }

  private initNode(name: string, members: ConceptReference[] = []): Observable<ConceptReferenceNode> {
    let nodeObservable: Subject<ConceptReferenceNode> = new ReplaySubject();

    let node: ConceptReferenceNode = this.toConceptReferenceNode("app-value-set-library-" + name, name);

    if(members != null && members.length > 0) {
      let memberNodes: ConceptReferenceNode[] = members.map(child => this.toConceptReferenceNode(child.iri, child.name));
      node.children = memberNodes;
      node.hasChildren = true;
      this.service.getConceptsHaveChildren(memberNodes.map(m => m.iri), false)
        .subscribe(
          (result) => {
            memberNodes
              .filter(m => result.includes(m.iri))
              .forEach(m => m.hasChildren = true);
            nodeObservable.next(node);
            nodeObservable.complete();
          },
          (error) => this.log.error(error)
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

  download(type: string, expanded: boolean) {
    this.busy = true;
    const filename = this.concept.name + (expanded ? '_expanded' : '') + ('text/csv' === type ? '.csv' : '.json');

    this.service.downloadValuesetMembers(this.concept.iri, expanded, type)
      .subscribe(
        (response) => this.downloadFile(response, filename, type),
        (error) => {
          this.busy = false;
          this.log.error(error);
        }
      );
  }

  downloadFile(data: any, filename: string, type: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    this.busy = false;
  }

}
