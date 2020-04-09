import { Component, OnInit } from '@angular/core';
import {RecordModelService} from '../record-model.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {TreeNode} from '../../models/TreeNode';
import {TreeSource} from './TreeSource';
import {Concept} from '../../models/Concept';
import {Related} from '../../models/Related';
import {ActivatedRoute} from '@angular/router';
import {LoggerService} from 'dds-angular8/logger';
import {Property} from '../../models/Property';

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
  properties: Property[];
  selectedNode: TreeNode;
  searchTerm: string;
  searchResults: any[];
  searching = false;
  searchSize = 72;
  root = 'rm:RecordModel';
  relationships = ['sn:SN_116680003'];

  getLevel = (node: TreeNode) => node.level;
  isExpandable = (node: TreeNode) => node.expandable;
  hasChild = (_: number, nodeData: TreeNode) => nodeData.expandable;

  constructor(private service: RecordModelService,
              private route: ActivatedRoute,
              private log: LoggerService) {
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new TreeSource(this.treeControl, service, log, this.relationships);
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => this.loadTree(params.id)
    );
  }

  clear() {
    this.searchTerm = '';
    this.searchSize = 72;
    this.searching = false;
  }

  search() {
    this.searchResults = null;
    this.searching = true;
    this.service.search(this.searchTerm, this.root, this.relationships).subscribe(
      (result) => this.showResults(result),
      (error) => {
        this.log.error(error);
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
      (error) => this.log.error(error)
    );

    this.service.getDefinition(node.id).subscribe(
      (result) => this.definition = result,
      (error) => this.log.error(error)
    );

    this.service.getProperties(node.id).subscribe(
      (result) => this.properties = result,
      (error) => this.log.error(error)
    );
  }

  showConceptTree(concept: Concept) {
    this.service.loadTree(this.root, concept.iri, this.relationships).subscribe(
      (result) => this.buildTree(concept, result),
      (error) => this.log.error(error)
    );
  }

  buildTree(concept: Concept, related: Related[]) {
    let i = 0;

    const node: TreeNode = new TreeNode(concept.iri, concept.name, related.length, true);

    related.reverse();

    this.dataSource.data =
    related
      .map(r => new TreeNode(r.concept.iri, r.concept.name, i++, true))
      .concat(node);

    this.selectNode(node);
  }

  loadTree(id: string) {
    if (id) {
      this.service.getConcept(id).subscribe(
        (result) => this.showConceptTree(result),
        (error) => this.log.error(error)
      );
    } else {
      this.service.getConcept(this.root).subscribe(
        (result) => this.dataSource.data = [new TreeNode(result.iri, result.name, 0, true)],
        (error) => this.log.error(error)
      );
    }
  }
}
