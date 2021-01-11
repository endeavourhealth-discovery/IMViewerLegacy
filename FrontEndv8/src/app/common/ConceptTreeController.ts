import { SelectionChange } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { NgEventBus } from "ng-event-bus";
import { Observable, Subject } from "rxjs";
import { ConceptReferenceNode } from "src/app/models/objectmodel/ConceptReferenceNode";
import { ConceptService } from "src/app/services/concept.service";
import { LoggerService } from "src/app/services/logger.service";
import { ConceptTreeModel } from "./ConceptTreeModel";
import { MatTreeNestedDataSource } from '@angular/material/tree';

export class ConceptTreeController {

    static NODE_SELECTED_EVENT: string = "app:ConceptTree-node-selected";

    treeControl: NestedTreeControl<ConceptReferenceNode>;
    dataSource: MatTreeNestedDataSource<ConceptReferenceNode>;
  
    isViewable: boolean;
  
    private selectedIri: string;

    private model: ConceptTreeModel;

    constructor(private service: ConceptService,
                private log: LoggerService,
                private eventBus: NgEventBus) {

        this.model = new ConceptTreeModel();
        
        this.dataSource = new MatTreeNestedDataSource<ConceptReferenceNode>();
        this.treeControl = new NestedTreeControl<ConceptReferenceNode>(node => this.model.getChildrenObservable(node))
        
        this.isViewable = false;  

        //this.view = new ConceptTreeView(log, new NestedTreeControl<ConceptReferenceNode>(node => this.model.getChildrenObservable(node)));

        // handle expansion - may result in fetching children from the API
        // and incorporating them into the tree
        this.treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<ConceptReferenceNode>).added) {
                this.onExpand(change.added);
            }
        });

         // wire the view to listen to model
        this.model.dataChange.subscribe(change => {
            this.dataSource.data = change;
            this.isViewable = true;
        })
    }

    setDataAndSelectedNode(data: ConceptReferenceNode, selectedNode: ConceptReferenceNode) {
        // reset the model to remove old data
        this.model.clear();
        
        this.model.addNode(data);

        this.selectedIri = selectedNode.iri;
        this.expand(selectedNode);
    }

    // attached to single click event (see HTML template)
    selectNode(node: ConceptReferenceNode): void {
        this.selectedIri = node.iri;
        this.eventBus.cast(ConceptTreeController.NODE_SELECTED_EVENT, { selectedIri: node.iri, origin: this });
    }

    highlightNode(node: ConceptReferenceNode): boolean {
        return this.selectedIri == node.iri;
    }

    // attached to double click event (see HTML template)
    expandNode(node: ConceptReferenceNode): void {
        if (node.hasChildren) {
            if (node.children == null || node.children.length == 0) {
                this.fetchChildren(node.iri).subscribe(
                    result => {
                        this.model.addChildren(node, result)
                    },
                    error => {
                        this.log.error(error);
                    }
                );
            }
        }
    }

    hasChild(_: number, node: ConceptReferenceNode): boolean {
        return node.hasChildren;
    }

    isVisible(node: ConceptReferenceNode): boolean {
        return this.treeControl.isExpanded(node);
    } 
  
    // used for manual-expansion of selected node (by user clicking expand icon: ">")
    private onExpand(nodesToExpand: ConceptReferenceNode[]) {
        nodesToExpand.forEach(nodeToExpand => this.expandNode(nodeToExpand));

        // TODO - put in loading logic progress bar
    }

    private fetchChildren(iri: string): Observable<ConceptReferenceNode[]> {
        let children: Subject<ConceptReferenceNode[]> = new Subject();

        this.service.getConceptChildren(iri).subscribe(
            (result) => children.next(result),
            (error) => this.log.error(error)
        );

        return children;
    }

    // used for auto-expansion of selected node 
    // in this instance we have children locally
    private expand(node: ConceptReferenceNode): void {
        if(node.parents) {
            node.parents.forEach(parent => this.expand(parent))
        }

        this.treeControl.expand(node);
    }    
}