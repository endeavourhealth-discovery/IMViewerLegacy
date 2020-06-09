import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Concept} from './models/Concept';
import {Related} from './models/Related';
import {Property} from './models/Property';
import {PagedResultSet} from './models/PagedResultSet';

@Injectable({
  providedIn: 'root'
})
export class IMControlsService {

  constructor(private http: HttpClient) { }

  getProperties(iri: string, inherited: boolean = false): Observable<Property[]> {
    let params = new HttpParams();
    if (inherited) {
      params = params.append('inherited', 'true');
    }

    return this.http.get<Property[]>('api/' + iri + '/Properties', {params});
  }

  getDefinition(iri: string): Observable<Related[]> {
    return this.http.get<Related[]>('api/' + iri + '/Definition');
  }

  getSources(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>('api/' + iri + '/Sources', {params});
  }

  getTargets(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>('api/' + iri + '/Targets', {params});
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
