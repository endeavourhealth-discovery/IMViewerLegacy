import {TreeNode} from '../../models/TreeNode';
import {CollectionViewer, DataSource, SelectionChange} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {map} from 'rxjs/operators';
import {LoggerService} from 'dds-angular8/logger';
import {ConceptService} from '../../concept.service';

export class TreeSource implements DataSource<TreeNode> {

  dataChange = new BehaviorSubject<TreeNode[]>([]);

  get data(): TreeNode[] { return this.dataChange.value; }
  set data(value: TreeNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private treeControl: FlatTreeControl<TreeNode>,
              private database: ConceptService,
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
    if (!node.isLoading) {
      node.isLoading = true;
      const index = this.data.indexOf(node) + 1;

      // Get count of nodes at this level
      let count = 0;
      for (let i = index; i < this.data.length && this.data[i].level > node.level; i++) {
        count++;
      }

      if (expand) {
        if (node.id === '_LOADMORE_')
          this.loadMore(node, index, count);
        else
          this.expandChildren(node, index, count);
      } else {

        this.data.splice(index, count);
        this.dataChange.next(this.data);
        node.isLoading = false;
      }
    }
  }

  private loadMore(node: TreeNode, index: number, count: number) {
    console.error('Loading more...');
    this.database.getSources(node.parentNode.id, this.relationships, 15, node.page).subscribe(
      (result) => {
        const nodes = result
          .result
          .map(related => new TreeNode(related.concept.iri, related.concept.name, node.level, true, node.parentNode));

        // Add in paging node if required
        if (result.page * result.pageSize < result.totalRecords) {
          nodes.push(new TreeNode('_LOADMORE_', 'Load more...', node.level, false, node.parentNode, false, result.page + 1));
        }
        this.data.splice((index - 1), 1, ...nodes);

        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      },
      (error) => this.log.error(error)
    );
  }

  private expandChildren(node: TreeNode, index: number, count: number) {
    this.database.getSources(node.id, this.relationships, 15, node.page).subscribe(
      (result) => {

        if (node.page === 1 && result.result.length === 0) {
          node.expandable = false;
        } else {
          const existing = this.data.slice(index, index + count);

          const nodes = result
            .result
            .filter(c => existing.findIndex(v => v.id === c.concept.iri) === -1)
            .map(related => new TreeNode(related.concept.iri, related.concept.name, node.level + 1, true, node));

          // Add in paging node if required
          if (result.page * result.pageSize < result.totalRecords) {
            nodes.push(new TreeNode('_LOADMORE_', 'Load more...', node.level + 1, false, node, false, result.page + 1));
          }

          this.data.splice(index, 0, ...nodes);
        }
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      },
      (error) => this.log.error(error)
    );
  }
}
