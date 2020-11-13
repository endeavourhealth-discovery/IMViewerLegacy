import { ConceptPropertyObject } from '../models/old/ConceptPropertyObject';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {zip, Subject, Observable} from 'rxjs';
import {Clazz} from '../models/objectmodel/Clazz';
import {ConceptGroup} from '../models/old/ConceptGroup';
import {Related} from '../models/old/Related';
import {Property} from '../models/old/Property';
import {PagedResultSet} from '../models/old/PagedResultSet';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';
import {SchemeCount} from '../models/old/SchemeCount';
import {SchemeChildren} from '../models/old/SchemeChildren';
import {ValueSetMember} from '../models/old/ValueSetMember';
import {DataModelDefinition} from '../models/old/DataModelDefinition';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConceptService implements ConceptTreeViewService, DataModelNavigatorService {

  constructor(private http: HttpClient) { }

  getAxioms(iri: string): Observable<any[]> {
    return this.http.get<any[]>(environment.api + 'api/axioms/' + iri );
  }

  getProperties(iri: string, inherited: boolean = false): Observable<Property[]> {
    let params = new HttpParams();
    if (inherited) {
      params = params.append('inherited', 'true');
    }

    return this.http.get<Property[]>(environment.api + 'api/concepts/' + iri + '/Properties', {params});
  }

  getTextual(iri: string): Observable<string> {
    return this.http.get(environment.api + 'api/concepts/' + iri + '/Textual', { responseType: 'text'});
  }

  getDefinition(iri: string): Observable<Related[]> {
    return this.http.get<Related[]>(environment.api + 'api/concepts/' + iri + '/Definition');
  }

  getSources(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>(environment.api + 'api/concepts/' + iri + '/Sources', {params});
  }

  getTargets(iri: string, relationships: string[], limit: number = 0, page: number = 1): Observable<PagedResultSet<Related>> {
    let params = new HttpParams();
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }
    params = params.append('limit', limit.toString());
    params = params.append('page', page.toString());

    return this.http.get<PagedResultSet<Related>>(environment.api + 'api/concepts/' + iri + '/Targets', {params});
  }

  getConcept(iri: string): Observable<Clazz> {
    return this.http.get<Clazz>(environment.api + 'api/concept/' + iri);
  }

  search(searchTerm: string, root: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('term', searchTerm);
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<any>(environment.api + 'api/concepts/Search', {params});
  }

  loadTree(root: string, iri: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<Related[]>(environment.api + 'api/concepts/' + iri + '/Tree', {params});
  }

  getValueSetMembers(iri: string): Observable<ValueSetMember[]> {
    return this.http.get<ValueSetMember[]>(environment.api + 'api/concepts/' + iri + '/members');
  }

  getChildCountByScheme(iri: string): Observable<SchemeCount[]> {
    return this.http.get<SchemeCount[]>(environment.api + 'api/concepts/' + iri + '/childCountByScheme');
  }

  getChildrenByScheme(iri: string, scheme: string): Observable<SchemeChildren[]> {
    let params = new HttpParams();
    if (scheme)
      params = params.append('scheme', scheme);

    return this.http.get<SchemeChildren[]>(environment.api + 'api/concepts/' + iri + '/children', {params});
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

  getConceptPropertyObjects(iri: string) : Observable<ConceptPropertyObject[]> {
    return this.http.get<ConceptPropertyObject[]>(environment.api + 'api/conceptpropertyobjects/' + iri );
  }
}
