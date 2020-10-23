import {AbstractSecurityProvider} from './abstract-security-provider';
import {Observable} from 'rxjs';
import {User} from './models/User';
import {Project} from './models/Project';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {MenuOption} from 'dds-angular8';

@Injectable()
export class MockSecurityService implements AbstractSecurityProvider {
  constructor(private router: Router) {
  }

  getUser(): Observable<User> {
    return Observable.create((obs) =>
      obs.next({
        id: null,
        username: 'JohnSmith',
        forename: 'John',
        surname: 'Smith',
      } as User));
  }

  getProjects(): Observable<Project> {
    return undefined;
  }

  logout() {
  }

  secureRoutes() {
  }

  secureMenuItems(menuItems: MenuOption[]) {
  }

  goToProfile(user: User) {
  }
}
