import { ConceptReferenceNode } from '../models/objectmodel/ConceptReferenceNode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concept } from '../models/objectmodel/Concept';
import { environment } from '../../environments/environment';
import {ConceptReference} from '../models/objectmodel/ConceptReference';
import {ConceptTreeViewService} from '../components/concept-tree-view/concept-tree-view.service';
import {DataModelNavigatorService} from '../components/data-model-navigator/data-model-navigator.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptService implements ConceptTreeViewService, DataModelNavigatorService {

  constructor(private http: HttpClient) { }

  search(searchTerm: string, root: string = null, relationships: string[] = null) {
    let params = new HttpParams();
    params = params.append('nameTerm', searchTerm);
    if (root)
      params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<any>(environment.api + 'api/concept/', { params });
  }

  getConcept(iri: string): Observable<Concept> {
    return this.http.get<Concept>(environment.api + 'api/concept/' + iri);
  }

  getConceptChildren(iri: string): Observable<Array<ConceptReferenceNode>> {
    return this.http.get<Array<ConceptReferenceNode>>(environment.api + 'api/concept/' + iri + '/children');
  }

  getConceptParents(iri: string): Observable<Array<ConceptReferenceNode>> {
    return this.http.get<Array<ConceptReferenceNode>>(environment.api + 'api/concept/' + iri + '/parents');
  }

  findUsages(iri: string): Observable<Array<ConceptReference>> {
    return this.http.get<Array<ConceptReference>>(environment.api + 'api/concept/' + iri + '/usages');
  }

  isOfType(iri: string, candidates: string[]): Observable<Array<ConceptReference>> {
    return this.http.post<Array<ConceptReference>>(environment.api + 'api/concept/' + iri + '/isWhichType', candidates);
  }
}
