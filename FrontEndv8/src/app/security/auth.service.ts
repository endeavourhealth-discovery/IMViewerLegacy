import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs/internal/observable/from';
import { SignUpParams } from '@aws-amplify/auth/lib-esm/types';
const debug = (message: string) => {}; // console.log(message);

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  public getToken(): string {
    const u = this.getUser();
    debug('Token: ' + u.signInUserSession.accessToken.jwtToken);
    return u.signInUserSession.accessToken.jwtToken;
  }

  login(username: string, password: string) {
    debug('logging in');
    return from(Auth.signIn(username, password))
      .pipe(
        map(user => {
          debug('storing token ' + JSON.stringify(user))
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
      debug('Deleting token');
      localStorage.removeItem('currentUser');
      debug('Sign out');
      const user = await Auth.signOut();
      debug('Reload');
      location.reload(true);
    } catch (error) {
      console.error(error);
    }
  }
}
