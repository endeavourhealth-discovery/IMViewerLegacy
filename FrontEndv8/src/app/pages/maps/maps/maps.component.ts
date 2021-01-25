import { Component, OnInit } from '@angular/core';
import {Perspectives} from '../../../services/perspective.service';
import {ActivatedRoute} from '@angular/router';
import {LoggerService} from '../../../services/logger.service';
import {ConceptService} from '../../../services/concept.service';
import {ConceptReferenceNode} from '../../../models/objectmodel/ConceptReferenceNode';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  rootNode : ConceptReferenceNode;
  highlight: ConceptReferenceNode;

  constructor(public perspectives: Perspectives,
              private route: ActivatedRoute,
              private log: LoggerService,
              private service: ConceptService) { }

  ngOnInit() {
    this.highlight = {
      iri: "sn:29857009",
      name: "Chest pain (finding)"
    } as ConceptReferenceNode;
    this.navigateTo(this.highlight);
  }

  navigateTo(node: ConceptReferenceNode) {
    this.rootNode = node;

    this.service.getConceptChildren(this.rootNode.iri).subscribe(
      (result) => this.rootNode.children = result,
      (error) => this.log.error(error)
    );

    this.service.getConceptParents(this.rootNode.iri).subscribe(
      (result) => this.rootNode.parents = result,
      (error) => this.log.error(error)
    );

  }

  expand(node: ConceptReferenceNode, type: number) {
    if (type == 1) {
      if (node.children != null) {
        node.children = null;
      } else {
        this.service.getConceptChildren(node.iri).subscribe(
          (result) => node.children = result,
          (error) => this.log.error(error)
        );
      }
    } else if (type == -1) {
      if (node.parents != null) {
        node.parents = null;
      } else {
        this.service.getConceptParents(node.iri).subscribe(
          (result) => node.parents = result,
          (error) => this.log.error(error)
        );
      }
    }
  }

  getIcon(node: ConceptReferenceNode, type: number) {
    if (type == 1)
      return (node.children == null) ? 'fas fa-fw fa-chevron-down' : 'fas fa-fw fa-minus';
    else if (type == -1)
      return (node.parents == null) ? 'fas fa-fw fa-chevron-up' : 'fas fa-fw fa-minus';
    else
      return 'fas fa-fw fa-minus';
  }
}
