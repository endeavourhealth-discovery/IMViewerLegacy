import { Component, OnInit } from '@angular/core';
import {RecordModelService} from '../record-model.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {TreeNode} from '../../models/TreeNode';
import {TreeSource} from './TreeSource';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';

@Component({
  selector: 'app-record-model-library',
  templateUrl: './record-model-library.component.html',
  styleUrls: ['./record-model-library.component.css']
})
export class RecordModelLibraryComponent implements OnInit {
  treeControl: FlatTreeControl<TreeNode>;
  dataSource: TreeSource;
  concept: Concept;
  definition: Related[];
  selectedNode: TreeNode;
  searchTerm: string;
  searchResults: any[];
  searching: boolean = false;
  searchSize = 64;
  root = 'SN_363787002';
  relationships = ['SN_116680003'];

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => node.expandable;
  hasChild = (_: number, nodeData: TreeNode) => nodeData.expandable;

  constructor(private service: RecordModelService) {
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new TreeSource(this.treeControl, service, this.relationships);
  }

  ngOnInit() {
    this.service.getConcept(this.root).subscribe(
      (result) => this.dataSource.data = [new TreeNode(result.id, result.name, 0, true)],
      (error) => console.error(error)
    );
  }

  clear() {
    this.searchTerm = '';
    this.searchSize = 64;
    this.searching = false;
  }

  search() {
    this.searchResults = null;
    this.searching = true;
    this.service.search(this.searchTerm, this.root, this.relationships).subscribe(
      (result) => this.showResults(result),
      (error) => {
        console.error(error);
        this.searching = false;
      }
    );
  }

  showResults(searchResults: any[]) {
    this.searchResults = searchResults;
    this.searchSize = 256;
    this.searching = false;
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
    this.service.getConcept(node.id).subscribe(
      (result) => this.concept = result,
      (error) => console.error(error)
    );

    this.service.getTargets(node.id, []).subscribe(
      (result) => this.definition = result,
      (error) => console.error(error)
    );
  }

  selectResult(concept: Concept) {
    this.service.loadTree(this.root, concept.id, this.relationships).subscribe(
      (result) => this.buildTree(concept, result),
      (error) => console.error(error)
    );
  }

  buildTree(concept: Concept, related: Related[]) {
    let i =0;
    this.dataSource.data =
    related
      .reverse()
      .map(r => new TreeNode(r.concept.id, r.concept.name, i++, true))
      .concat(new TreeNode(concept.id, concept.name, i++, true));
  }
}
