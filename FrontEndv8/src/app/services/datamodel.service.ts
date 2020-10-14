import { Property } from './../models/datamodel/Property';
import { DataModelDetail } from './../models/datamodel/DataModelDetail';
import { DataModel } from './../models/datamodel/DataModel';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';

@Injectable({
  providedIn: 'root'
})
export class DataModelService {

  constructor(private http: HttpClient) { }

  search(term: string): Observable<DataModel[]> {
    return this.http.get<DataModel[]>('http://localhost:8081/datamodel/search?term=' + term);
  }

  getDataModel(iri: string): Observable<DataModelDetail> {
    return this.http.get<DataModelDetail>('http://localhost:8081/datamodel/' + iri);
  }

  getProperties(iri: string): Observable<Property[]> {
    return this.http.get<Property[]>('http://localhost:8081/datamodel/' + iri + '/properties');
  }

  getChildren(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/datamodel/' + iri + '/children');
  }

  getParents(iri: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:8081/datamodel/' + iri + '/parents');
  }


}
