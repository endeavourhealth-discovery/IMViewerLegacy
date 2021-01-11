import { Subject, BehaviorSubject, ReplaySubject, Observable } from "rxjs";
import { ConceptReferenceNode } from "src/app/models/objectmodel/ConceptReferenceNode";

export class ConceptTreeModel {
    dataChange: BehaviorSubject<ConceptReferenceNode[]> = new BehaviorSubject([]);
    
    // it is very important that every node in the tree is registered in this map
    // and that when that node's children are changed that the associated Subject
    // is updated. This is the basis for the tree control being kept in sync with
    // the data
    private childrenSubjects: Map<string, Subject<ConceptReferenceNode[]>> = new Map();

    // every node in the tree indexed by its iri
    private nodes: Map<string, ConceptReferenceNode> = new Map();
    private roots: ConceptReferenceNode[] = [];

    addNode(node: ConceptReferenceNode): void {

        //this.addNode(node);

        // attach parents
        this.initAncestors(node);

        // attach children
        this.initDecendants(node);

        // mark this as a root node if appropriate
        this.updateRoots(node);

        this.dataChange.next(this.getRoots());
    }

    addChildren(parent: ConceptReferenceNode, children: ConceptReferenceNode[]) {
        let registeredParent = this.getNode(parent.iri);
        
        if(registeredParent == null) {
            // error
        }
        else if(registeredParent.children != null && registeredParent.children.length > 0) {
            // error
        }
        else {
            registeredParent.children = children;
    
            this.initDecendants(registeredParent);

            this.dataChange.next(this.getRoots());
        }
    }

    getNode(iri: string): ConceptReferenceNode {
        return this.nodes.get(iri);
    }

    getRoots(): ConceptReferenceNode[] {
        return this.roots;
    }

    getChildrenObservable(node: ConceptReferenceNode): Observable<ConceptReferenceNode[]> {
        let childrenSubject: Subject<ConceptReferenceNode[]> = this.childrenSubjects.get(node.iri);
    
        return childrenSubject;
    }

    clear(): void {
        this.childrenSubjects.clear();
        this.roots = [];
        this.nodes.clear();

        this.dataChange.next(this.getRoots());
    }

    private initAncestors(child: ConceptReferenceNode): void {

        if (child.parents != null) {
            child.parents.forEach(parent => {
                // we want the exact same node by Object reference, NOT by value equality
                if (this.registerNode(parent) == false) {
                    // we will need an initialised children array later on
                    if (parent.children == null) {
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
                    parent = this.getNode(parent.iri);
                    child.parents[parentIndex] = parent;
                }

                // only update the parent if it does not already contain the child
                if (parent.children.includes(child) == false) {
                    parent.children.push(child);
                    this.childrenSubjects.get(parent.iri).next(parent.children);

                    // unwind up the hierarchy
                    this.initAncestors(parent);
                }
            })
        }
    }

    private initDecendants(node: ConceptReferenceNode): void {
        // attach children
        this.registerChildrenObservable(node);

        if (node.children != null) {
            node.children.forEach(child => {
                this.initDecendants(child);

                child.parents = [node];
                this.registerChildrenObservable(child);
                this.addNode(child);
            });
        }

        // this must be done AFTER te child nodes have been registered
        this.childrenSubjects.get(node.iri).next(node.children);
    }

    private registerNode(node: ConceptReferenceNode): boolean {
        let added: boolean = false;

        if (this.nodes.has(node.iri) == false) {
            this.nodes.set(node.iri, node);
            added = true;
        }

        return added;
    }

    private registerChildrenObservable(node: ConceptReferenceNode) {
        if (this.childrenSubjects.has(node.iri) == false) {
            this.childrenSubjects.set(node.iri, new ReplaySubject());
        }
    }

    private updateRoots(node: ConceptReferenceNode): void {
        // remove any nodes which since they were marked as root nodes
        // have been attached to a parent node
        this.roots = this.roots.filter(root => this.isRootNode(root))
        
        if(this.isRootNode(node)) {
            this.roots.push(node);
        }
    }

    private isRootNode(node: ConceptReferenceNode): boolean {
        return node.parents == null || node.parents.length == 0;
    }
}