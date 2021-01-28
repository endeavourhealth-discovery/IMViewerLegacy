import { ConceptReferenceNode } from '../models/objectmodel/ConceptReferenceNode';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, Subject, zip } from 'rxjs';
import { Concept } from '../models/objectmodel/Concept';
import { environment } from '../../environments/environment';
import {ConceptReference} from '../models/objectmodel/ConceptReference';
import {HealthRecordNavigatorService} from '../components/health-record-navigator/health-record-navigator.service';
import {SearchRequest} from '../models/search/SearchRequest';
import {SearchResponse} from '../models/search/SearchResponse';
import {Option} from '@angular/cli/models/interface';

export interface ConceptAggregate {
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
}

@Injectable({
  providedIn: 'root'
})
export class ConceptService implements HealthRecordNavigatorService {

  constructor(private http: HttpClient) { }

  search(searchTerm: string, root: string = null, relationships: string[] = null, limit: number = 20) {
    let params = new HttpParams();
    params = params.append('nameTerm', searchTerm);
    params = params.append('limit', limit.toString());
    if (root)
      params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<ConceptReference[]>(environment.api + 'api/concept/', { params });
  }

  advancedSearch(request: SearchRequest) {
    return this.http.post<SearchResponse>(environment.api + 'api/concept/search', request);
  }

  getConcept(iri: string): Observable<Concept> {
    return this.http.get<Concept>(environment.api + 'api/concept/' + iri);
  }

  getConceptImLang(iri: string): Observable<any> {
    const requestOptions: Object = {
      headers: {
        accept: 'application/imlang'
      },
      responseType: 'text'
    }
    return this.http.get<any>(environment.api + 'api/concept/' + iri, requestOptions);
  }

  getConceptHasChildren(iri: string, includeLegacy: boolean = false): Observable<Boolean> {
    return this.http.get<Boolean>(environment.api + 'api/concept/' + iri + '/hasChildren');
  }

  getConceptChildren(iri: string): Observable<Array<ConceptReferenceNode>> {
    return this.http.get<Array<ConceptReferenceNode>>(environment.api + 'api/concept/' + iri + '/children');
  }

  getConceptParentHierarchy(iri: string): Observable<Array<ConceptReferenceNode>> {
    return this.http.get<Array<ConceptReferenceNode>>(environment.api + 'api/concept/' + iri + '/parentHierarchy');
  }

  getConceptParents(iri: string): Observable<Array<ConceptReferenceNode>> {
    return this.http.get<Array<ConceptReferenceNode>>(environment.api + 'api/concept/' + iri + '/parents');
  }

  getAncestorDefinitions(iri: string): Observable<Array<Concept>> {
    return this.http.get<Array<Concept>>(environment.api + 'api/concept/' + iri + '/parents/definitions');
  }

  findUsages(iri: string): Observable<Array<ConceptReference>> {
    return this.http.get<Array<ConceptReference>>(environment.api + 'api/concept/' + iri + '/usages');
  }

  isOfType(iri: string, candidates: string[]): Observable<Array<ConceptReference>> {
    return this.http.post<Array<ConceptReference>>(environment.api + 'api/concept/' + iri + '/isWhichType', candidates);
  }

  isA(iri: string, parentIri: string): Observable<boolean> {
    let isAObservable: Subject<boolean> = new Subject();

    this.isOfType(iri, [parentIri]).subscribe(
      response => {
        let match = false;
        response.forEach(parent => {
          if(parent.iri == parentIri) {
            match = true;
          }
        })
        isAObservable.next(match);
      }
    )

    return isAObservable;
  }

  getConceptAggregate(iri: string): Observable<ConceptAggregate> {
    let conceptAggregate: Subject<ConceptAggregate> = new Subject();

    zip(this.getConcept(iri),
        this.getConceptChildren(iri),
        this.getConceptParentHierarchy(iri)).subscribe(([concept, children, parents]) => {
          conceptAggregate.next({
            concept: concept,
            children: children,
            parents: parents
          });
        }
    )

    return conceptAggregate;
  }

  downloadValuesetMembers(iri: string, expand: boolean = false, type: string = '*/*'): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', type);

    let params: HttpParams = new HttpParams();
    params = params.append('expanded', expand ? 'true' : 'false');
    return this.http.get(environment.api + 'api/concept/' + iri + '/members', {headers, params, responseType: 'text'});
  }

}
