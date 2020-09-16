import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {zip, Subject, Observable} from 'rxjs';
import {Concept} from './models/Concept';
import {ConceptGroup} from './models/ConceptGroup';
import {Related} from './models/Related';
import {Property} from './models/Property';
import {PagedResultSet} from './models/PagedResultSet';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';
import {SchemeCount} from './models/SchemeCount';
import {SchemeChildren} from './models/SchemeChildren';
import {ValueSetMember} from './models/ValueSetMember';
import {DataModelDefinition} from './models/DataModelDefinition';

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

  getTextual(iri: string): Observable<string> {
    return this.http.get('api/concepts/' + iri + '/Textual', { responseType: 'text'});
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
      {name: 'group 1', description: 'description', concepts: concepts},
      {name: 'group 2', description: 'description', concepts: concepts},
      {name: 'group 3', description: 'description', concepts: concepts},
    ];

    return Observable.create((observer) => {
      observer.next(conceptGroups);
    });  
  }  
    
  // orachstrtes retirevle of all relevent data
  getDataModelDefinition(iri: string): Observable<DataModelDefinition> {
    let dataModelDefintionSubject: Subject<DataModelDefinition> = new Subject<DataModelDefinition>();
    let dataModelDefintion: Observable<DataModelDefinition> = dataModelDefintionSubject.asObservable();
    
    // TODO - get inherited properties

    const responses = zip(
      this.getConcept(iri),
      this.getDefinition(iri),
      this.getProperties(iri, true), //currently the inherited param is ignored. Will not reinstate for now as DB structure is under change
      this.getSources(iri, [], 15),
      this.getTargets(iri, [], 15)
    );
    
    responses.subscribe(
      (result) => {
        dataModelDefintionSubject.next(
          new DataModelDefinition(      
             result[0],
             result[1],
             result[2],
             result[3].result,
             result[4].result,
          )
        )
      }
    );

    return dataModelDefintion;
  }
}
