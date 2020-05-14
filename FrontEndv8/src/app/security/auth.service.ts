import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from './User';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  public getUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  public getToken(): string {
    const u = this.getUser();
    return window.btoa(u.username + ':' + u.token);
  }

  login(username: string, password: string) {
    return this.http.post<User>('public/Authenticate', { username, password })
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        // user.authData = window.btoa(username + ':' + user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }));
  }

  register(username: string, firstName: string, lastName: string, password: string) {
    const body = {
      username,
      firstName,
      lastName,
      password
    };
    return this.http.post<User>('public/Register', body)
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        // user.authData = window.btoa(username + ':' + user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }));
  }


  logout() {
    // remove user from local storage to log user out
    console.log('Logging out');
    localStorage.removeItem('currentUser');
    location.reload(true);
  }
}
