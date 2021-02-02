
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SearchResponseConcept } from '../models/search/SearchResponseConcept';

@Injectable({
  providedIn: 'root'
})
export class ConfigService  {

  constructor(private http: HttpClient) { }

  getQuickAccess() {
    return this.http.get<SearchResponseConcept[]>(environment.api + 'api/config/quickAccess');
  }
}
