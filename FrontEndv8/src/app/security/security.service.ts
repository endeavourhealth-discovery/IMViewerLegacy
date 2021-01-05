import {Observable} from 'rxjs';
import {User} from './models/User';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './auth.service';
import {from} from 'rxjs/internal/observable/from';

@Injectable()
export class SecurityService {
  constructor(private router: Router, private authService: AuthenticationService) {
  }

  getUser(): Observable<User> {
    let user = this.authService.getUser();
    console.log(user);
    return Observable.create((obs) =>
      obs.next({
        id: user.attributes.sub,
        username: user.username,
        email: user.attributes.email,
        forename: user.attributes['custom:forename'],
        surname: user.attributes['custom:surname'],
        avatar: user.attributes['custom:avatar']
      } as User));
  }

  updateUser(user: User): Observable<string> {
    return from(this.authService.updateUser(user.id, user.email, user.forename, user.surname, user.avatar));
  }

  logout() {
    this.authService.logout();
  }
}
