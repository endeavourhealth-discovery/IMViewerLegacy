import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs/internal/observable/from';
import { SignUpParams } from '@aws-amplify/auth/lib-esm/types';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserPool, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import {Observable} from 'rxjs';
const debug = (message: string) => { /* console.log(message); */ };

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor() {
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  public getToken(): string {
    const u = this.getUser();
    if (u === null || u.signInUserSession === null) {
      return null;
    } else {
      debug('Token: ' + u.signInUserSession.accessToken.jwtToken);
      return u.signInUserSession.accessToken.jwtToken;
    }
  }

  login(username: string, password: string) {
    debug('logging in');
    return from(Auth.signIn(username, password))
      .pipe(
        map(user => {
          debug('storing token ' + JSON.stringify(user));
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
  }

  register(username: string, password: string, email: string, forename: string, surname: string, avatar: string) {
    const params: SignUpParams = {
      username,
      password,
      attributes: {
        email,
        'custom:forename': forename,
        'custom:surname': surname,
      }
    };

    if (avatar)
      params.attributes['custom:avatar'] = avatar;

    return from(Auth.signUp(params));
  }

  async updateUser(id: string, email: string, forename: string, surname: string, avatar: string) : Promise<string> {
    const user = await Auth.currentAuthenticatedUser();

    if (user.attributes.sub === id) {

      const atts: object = {
        email,
        'custom:forename': forename,
        'custom:surname': surname,
        'custom:avatar': avatar,
      };

      Auth.updateUserAttributes(user, atts);
    } else
      return null;
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
      await Auth.signOut();
      debug('Reload');
      location.reload(true);
    } catch (error) {
      console.error(error);
    }
  }

  refreshToken() {
    debug('Refreshing token');
    const u = this.getUser();
    debug(u);

    if (u === null || u.signInUserSession === null) {
      // No user data or no session, force logout
      return from(this.logout());
    } else {


      return new Observable((obs) => {

        // Build cognito user
        const cu: CognitoUser = new CognitoUser({
          Username: u.username,
          Pool: new CognitoUserPool({
            ClientId: u.pool.clientId,
            UserPoolId: u.pool.userPoolId
          })
        });

        // Call for new token
        cu.refreshSession(new CognitoRefreshToken({RefreshToken: u.signInUserSession.refreshToken.token}), (result) => {
          debug('Result');
          debug(result);
          if (cu.getSignInUserSession()
            && cu.getSignInUserSession().getAccessToken()
            && cu.getSignInUserSession().getAccessToken().getJwtToken()) {
            // We now have a token
            debug('storing token ' + JSON.stringify(cu));
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(cu));
            obs.next(cu.getSignInUserSession().getAccessToken().getJwtToken());
          } else {
            // Refresh failed, force logout
            obs.next(from(this.logout()));
          }
        });
      });
    }
  }
}
