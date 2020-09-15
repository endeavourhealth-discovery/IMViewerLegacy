import {Observable} from 'rxjs';
import {User} from './models/User';
import {Project} from './models/Project';
import {MenuOption} from 'dds-angular8';

export abstract class AbstractSecurityProvider {
  abstract getUser(): Observable<User>;
  abstract getProjects(): Observable<Project>
  abstract logout();
  abstract secureRoutes();
  abstract secureMenuItems(menuItems: MenuOption[]);
  abstract goToProfile(user: User);
}
