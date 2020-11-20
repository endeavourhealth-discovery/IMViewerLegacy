import { ConceptReferenceNode } from './../models/objectmodel/ConceptReferenceNode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concept } from '../models/objectmodel/Concept';
import { ConceptTreeViewService, DataModelNavigatorService } from 'im-common/im-controls';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConceptService implements ConceptTreeViewService, DataModelNavigatorService {

  constructor(private http: HttpClient) { }

  search(searchTerm: string, root: string, relationships: string[]) {
    let params = new HttpParams();
    params = params.append('term', searchTerm);
    params = params.append('root', root);
    if (relationships != null) {
      relationships.forEach(r => params = params.append('relationship', r));
    }

    return this.http.get<any>(environment.api + 'api/concepts/Search', { params });
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
}
