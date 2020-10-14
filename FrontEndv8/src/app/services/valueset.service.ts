import { Code } from './../models/valueset/Code';
import { ValueSetDetail } from './../models/valueset/ValueSetDetail';
import { ValueSet } from './../models/valueset/ValueSet';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';

@Injectable({
  providedIn: 'root'
})
export class ValueSetService {

  constructor(private http: HttpClient) { }

  search(term: string): Observable<ValueSet[]> {
    return this.http.get<ValueSet[]>('http://localhost:8081/valueset/search?term=' + term);
  }

  getValueSet(iri: string): Observable<ValueSetDetail> {
    return this.http.get<ValueSetDetail>('http://localhost:8081/valueset/' + iri);
  }

  getMembers(iri: string): Observable<Code[]> {
    return this.http.get<Code[]>('http://localhost:8081/valueset/' + iri + '/members');
  }

  getChildren(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/valueset/' + iri + '/children');
  }

  getParents(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/valueset/' + iri + '/parents');
  }

}
