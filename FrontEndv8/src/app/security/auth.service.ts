import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs/internal/observable/from';
import { SignUpParams } from '@aws-amplify/auth/lib-esm/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  public getToken(): string {
    const u = this.getUser();
    return u.signInUserSession.accessToken.jwtToken;
  }

  login(username: string, password: string) {
    return from(Auth.signIn(username, password))
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
  }

  register(username: string, password: string, email: string) {
    const params: SignUpParams = {
      username: username,
      password: password,
      attributes: {
        email: email
      }
    };
    return from(Auth.signUp(params));
  }

  confirm(username: string, code: string) {
    return from(Auth.confirmSignUp(username, code));
  }


  async logout() {
    // remove user from local storage to log user out
    try {
      console.log('Logging out');
      const user = await Auth.signOut();
      localStorage.removeItem('currentUser');
      location.reload(true);
    } catch (error) {
      console.error(error);
    }
  }
}
