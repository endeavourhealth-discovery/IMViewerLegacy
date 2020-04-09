import {TreeNode} from '../../models/TreeNode';
import {CollectionViewer, DataSource, SelectionChange} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {RecordModelService} from '../record-model.service';
import {map} from 'rxjs/operators';
import {LoggerService} from 'dds-angular8/logger';

export class TreeSource implements DataSource<TreeNode> {

  dataChange = new BehaviorSubject<TreeNode[]>([]);

  get data(): TreeNode[] { return this.dataChange.value; }
  set data(value: TreeNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private treeControl: FlatTreeControl<TreeNode>,
              private database: RecordModelService,
              private log: LoggerService,
              private relationships: string[]) {}

  connect(collectionViewer: CollectionViewer): Observable<TreeNode[]> {
    this.treeControl.expansionModel.changed.subscribe(change => {
      if (change.added || change.removed) {
        this.handleTreeControl(change);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<TreeNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: TreeNode, expand: boolean) {
    const index = this.data.indexOf(node) + 1;
    node.isLoading = true;

    // Get count of nodes at this level
    let count = 0;
    for (let i = index; i < this.data.length && this.data[i].level > node.level; i++) {
      count++;
    }

    if (expand) {
      this.database.getSources(node.id, this.relationships).subscribe(
        (children) => {

          const existing = this.data.slice(index, index + count);

          const nodes = children
            .filter(c => existing.findIndex(v => v.id === c.concept.iri) === -1)
            .map(related => new TreeNode(related.concept.iri, related.concept.name, node.level + 1, true));
          this.data.splice(index, 0, ...nodes);

          // notify the change
          this.dataChange.next(this.data);
          node.isLoading = false;
        },
        (error) => this.log.error(error)
      );
    } else {

      this.data.splice(index, count);
      this.dataChange.next(this.data);
      node.isLoading = false;
    }
  }
}
