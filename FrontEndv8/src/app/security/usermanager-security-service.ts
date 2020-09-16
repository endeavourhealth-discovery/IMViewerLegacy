import {AbstractSecurityProvider} from './abstract-security-provider';
import {defer, from, Observable} from 'rxjs';
import {User} from './models/User';
import {Project} from './models/Project';
import {CanActivateRouteGuard, LoggerService, MenuOption, UserManagerService} from 'dds-angular8';
import {UserProfile} from 'dds-angular8/user-manager';
import {map} from 'rxjs/operators';
import {Route, Router} from '@angular/router';
import {ApplicationRef, Injectable} from '@angular/core';

@Injectable()
export class UsermanagerSecurityService implements AbstractSecurityProvider {
  constructor(private service: UserManagerService,
              private router: Router,
              private routeGuard: CanActivateRouteGuard,
              private log: LoggerService) {
  }

  getUser(): Observable<User> {
    return defer(() => from(this.service.getUserProfile())
      .pipe(
        map(result => this.mapUserProfile(result))
      )
    );
  }

  getProjects(): Observable<Project> {
    return undefined;
  }

  logout() {
    this.service.logout();
  }

  secureRoutes() {
    CanActivateRouteGuard.secureRoutes(this.router);
  }

  secureMenuItems(menuItems: MenuOption[]) {
    let routes: Route[] = this.router.config;
    for (let menuOption of menuItems) {
      let route: Route = routes.find(r => this.routeMatches(menuOption.state, r.path));
      this.routeGuard.checkRoleAccess(route.data.role).then(
        (access) => menuOption.access = access,
        (error) => this.log.error(error)
      );
    }
  }

  goToProfile(user: User) {
    window.open('https://devgateway.discoverydataservice.net/user-manager/profile/' + user.id, '_blank');
  }

  private mapUserProfile(userProfile: UserProfile): User {
    return {
      id: userProfile.uuid,
      username: userProfile.username,
      forename: userProfile.forename,
      surname: userProfile.surname,
      avatar: userProfile.photo,
      email: userProfile.email,
      internal: userProfile
    } as User;
  }

  private routeMatches(state: string, route: string) : boolean {
    const stateParts = state.split('/');
    const routeParts = route.split('/');

    if (routeParts.length !== stateParts.length)
      return false;

    for (let i = 0; i < routeParts.length; i++) {
      const r = routeParts[i];
      const s = stateParts[i];

      if (!r.startsWith(':') && r !== s)
        return null;
    }

    return true;
  }
}
