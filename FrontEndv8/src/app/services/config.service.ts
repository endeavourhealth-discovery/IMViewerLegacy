
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConceptSummary } from '../models/search/ConceptSummary';

@Injectable({
  providedIn: 'root'
})
export class ConfigService  {

  constructor(private http: HttpClient) { }

  getQuickAccess() {
    return this.http.get<ConceptSummary[]>(environment.api + 'api/config/quickAccess');
  }
}
