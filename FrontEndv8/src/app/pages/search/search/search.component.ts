import { Component, OnInit } from '@angular/core';
import {Perspectives} from '../../../services/perspective.service';
import {ActivatedRoute} from '@angular/router';
import {LoggerService} from '../../../services/logger.service';
import {ConceptService} from '../../../services/concept.service';
import {ConceptReference} from '../../../models/objectmodel/ConceptReference';
import {SearchRequest} from '../../../models/search/SearchRequest';
import {SearchResponse} from '../../../models/search/SearchResponse';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  request : SearchRequest = new SearchRequest();
  response : SearchResponse = new SearchResponse();
  schemes: ConceptReference[] = [];
  schemeSelection: ConceptReference[];
  searchSub: Subscription = null;

  constructor(public perspectives: Perspectives,
              private route: ActivatedRoute,
              private log: LoggerService,
              private service: ConceptService) { }

  ngOnInit() {
    this.perspectives.current = this.perspectives.search;
    this.route.queryParamMap.subscribe(
      (params) => {
        this.request.terms = params.get('terms');
        this.search()
      },
      (error) => this.log.error(error)
    );

    this.service.getConceptChildren(':551000252107').subscribe(
      (results) => this.schemes = this.schemeSelection = results,
      (error) => this.log.error(error)
    );
  }

  search() {
    if (this.searchSub != null) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }

    if (this.request.terms != null && this.request.terms.trim().length > 0) {
      this.response = null;

      this.searchSub = this.service.advancedSearch(this.request).subscribe(
        (result) => this.response = result,
        (error) => {
          this.response = new SearchResponse();
          this.log.error(error);
        }
      );
    }
  }

}
