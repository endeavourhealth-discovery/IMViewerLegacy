import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Concept} from '../models/Concept';
import {Related} from '../models/Related';
import {Property} from '../models/Property';

@Injectable({
  providedIn: 'root'
})
export class RecordModelService {

  constructor(private http: HttpClient) { }

  getProperties(iri: string): Observable<Property[]> {
    return this.http.get<Property[]>('api/' + iri + '/Properties');
  }

  getDefinition(iri: string): Observable<Related[]> {
    return this.http.get<Related[]>('api/' + iri + '/Definition');
  }

  getSources(iri: string, relationships: string[]): Observable<Related[]> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<Related[]>('api/' + iri + '/Sources', {params});
  }

  getConcept(iri: string): Observable<Concept> {
    return this.http.get<Concept>('api/' + iri);
  }

  search(searchTerm: string, root: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('term', searchTerm);
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<any>('api/Search', {params});
  }

  loadTree(root: string, iri: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<Related[]>('api/' + iri + '/Tree', {params});
  }
}
