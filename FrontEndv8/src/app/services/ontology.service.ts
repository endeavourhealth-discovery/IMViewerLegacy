import { OntologicalConceptDetail } from './../models/ontology/OntologicalConceptDetail';
import { Axiom } from './../models/ontology/Axiom';
import { OntologicalConcept } from './../models/ontology/OntologicalConcept';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';

@Injectable({
  providedIn: 'root'
})
export class OntologyService {

  constructor(private http: HttpClient) { }

  search(term: string): Observable<OntologicalConcept[]> {
    return this.http.get<OntologicalConcept[]>('http://localhost:8081/ontology/search?term=' + term);
  }

  getOntology(iri: string): Observable<OntologicalConceptDetail> {
    return this.http.get<OntologicalConceptDetail>('http://localhost:8081/ontology/' + iri);
  }

  getAxioms(iri: string): Observable<Axiom[]> {
    return this.http.get<Axiom[]>('http://localhost:8081/axioms/' + iri );
  }

  getChildren(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/ontology/' + iri + '/children');
  }

  getParents(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/ontology/' + iri + '/parents');
  }

}
