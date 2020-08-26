import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Concept} from './models/Concept';
import {ConceptGroup} from './models/ConceptGroup';
import {Related} from './models/Related';
import {Property} from './models/Property';
import {PagedResultSet} from './models/PagedResultSet';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';
import {SchemeCount} from './models/SchemeCount';
import {SchemeChildren} from './models/SchemeChildren';
import {ValueSetMember} from './models/ValueSetMember';

@Injectable({
  providedIn: 'root'
})
export class ConceptService implements ConceptTreeViewService, DataModelNavigatorService {

  constructor(private http: HttpClient) { }

  getProperties(iri: string, inherited: boolean = false): Observable<Property[]> {
    let params = new HttpParams();
    if (inherited) {
      params = params.append('inherited', 'true');
    }

    return this.http.get<Property[]>('api/concepts/' + iri + '/Properties', {params});
  }

  getDefinition(iri: string): Observable<Related[]> {
    return this.http.get<Related[]>('api/concepts/' + iri + '/Definition');
  }

  getSources(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>('api/concepts/' + iri + '/Sources', {params});
  }

  getTargets(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>('api/concepts/' + iri + '/Targets', {params});
  }

  getConcept(iri: string): Observable<Concept> {
    return this.http.get<Concept>('api/concepts/' + iri);
  }

  search(searchTerm: string, root: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('term', searchTerm);
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<any>('api/concepts/Search', {params});
  }

  loadTree(root: string, iri: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<Related[]>('api/concepts/' + iri + '/Tree', {params});
  }

  getValueSetMembers(iri: string): Observable<ValueSetMember[]> {
    return this.http.get<ValueSetMember[]>('api/concepts/' + iri + '/members');
  }

  getChildCountByScheme(iri: string): Observable<SchemeCount[]> {
    return this.http.get<SchemeCount[]>('api/concepts/' + iri + '/childCountByScheme');
  }

  getChildrenByScheme(iri: string, scheme: string): Observable<SchemeChildren[]> {
    let params = new HttpParams();
    if (scheme)
      params = params.append('scheme', scheme);

    return this.http.get<SchemeChildren[]>('api/concepts/' + iri + '/children', {params});
  }

  getConceptGroups(iri: string): Observable<ConceptGroup[]> {
    // temp test data until model and backend are worked out
    let concepts: Concept[] = [
      {name: 'Concept 1 name', description: 'Concept 1 desc', iri: ':DM_HealthEvent'},
      {name: 'Concept 2 name', description: 'Concept 2 desc', iri: ':DM_PatientEvent'},
      {name: 'Concept 3 name', description: 'Concept 3 desc', iri: ':DM_EncounterEntry'},
      {name: 'Concept 4 name', description: 'Concept 4 desc', iri: 'Concept iri'}
    ]
    
    let conceptGroups: ConceptGroup[] = [
      {name: 'Concept group 1 name', description: 'Concept group 1 desc', concepts: concepts},
      {name: 'Concept group 2 name', description: 'Concept group 2 desc', concepts: concepts},
      {name: 'Concept group 3 name', description: 'Concept group 3 desc', concepts: concepts},
      {name: 'Concept group 4 name', description: 'Concept group 4 desc', concepts: concepts},
      {name: 'Concept group 5 name', description: 'Concept group 5 desc', concepts: concepts},
      {name: 'Concept group 6 name', description: 'Concept group 6 desc', concepts: concepts},
      {name: 'Concept group 7 name', description: 'Concept group 7 desc', concepts: concepts},
      {name: 'Concept group 8 name', description: 'Concept group 8 desc', concepts: concepts}
    ];

    return Observable.create((observer) => {
      observer.next(conceptGroups);
    });    
    
    //return Observable.create(conceptGroups); //TODO - data
    //return this.http.get<Concept>('api/concepts/' + iri);
  }
}
