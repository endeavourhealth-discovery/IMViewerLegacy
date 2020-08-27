// TODO: AppRoot to be extracted to common by splitting LayoutComponent

import {Component, HostBinding, OnInit} from '@angular/core';
import {AbstractMenuProvider, CanActivateRouteGuard, LoggerService, MenuOption, UserManagerService} from 'dds-angular8';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {UserProfile, UserProject} from 'dds-angular8/user-manager';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AppMenuService} from './app-menu.service';
import {QuickMenu} from './QuickMenu';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.html',
  styleUrls: ['./app-root.scss']
})
export class AppRoot implements OnInit {
  @HostBinding('class') componentCssClass;

  title = '';
  user: UserProfile;
  userProjects: UserProject[];
  menuItems: MenuOption[] = [];
  currentProject: UserProject;
  quickMenu: QuickMenu;

  constructor(
    private router: Router,
    private userManagerService: UserManagerService,
    private log: LoggerService,
    public menuService: AbstractMenuProvider,
    private routeGuard: CanActivateRouteGuard,
    public overlayContainer: OverlayContainer
  ) { }

  ngOnInit() {
    CanActivateRouteGuard.secureRoutes(this.router);
    this.title = this.menuService.getApplicationTitle();
    this.menuItems = this.menuService.getMenuOptions();
    (this.menuService as AppMenuService).loadAppMenu().subscribe(
      (result) => this.quickMenu = result,
      (error) => this.log.error(error)
    );
    this.setMenuOptionAccess();

    this.getUserProfile();

    this.userManagerService.onProjectChange.subscribe(
      (newProject) => this.onProjectChange(newProject),
      (error) => this.log.error(error)
    );
  }

  setMenuOptionAccess() {
    let routes: Route[] = this.router.config;
    for (let menuOption of this.menuItems) {
      let route: Route = routes.find(r => this.routeMatches(menuOption.state, r.path));
      this.routeGuard.checkRoleAccess(route.data.role).then(
        (access) => menuOption.access = access,
        (error) => this.log.error(error)
      );
    }
  }

  routeMatches(state: string, route: string) : boolean {
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

  onProjectChange(project: UserProject) {
    this.currentProject = project;
    this.routeGuard.checkCurrentAccess();
    this.setMenuOptionAccess();
  }

  getUserProfile(force: boolean = false) {
    this.userManagerService.getUserProfile(force)
      .then(
        (profile) => this.setUserProfile(profile, force),
        (error) => this.log.error(error)
      );
  }

  setUserProfile(profile: UserProfile, force: boolean = false) {
    this.user = profile;
    this.userManagerService.getUserProjects(force)
      .then(
        (projects) => this.userProjects = projects,
        (error) => this.log.error(error)
      )
  }

  logout() {
    this.userManagerService.logout();
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  switchProject(project: UserProject) {
    this.userManagerService.setSelectedProject(project);
  }

  setDefault(project: UserProject) {
    this.userManagerService.getSelectedProject().then(
      (selectedProject) => {
        this.userManagerService.changeDefaultProject(project.id, selectedProject.id).subscribe(
          (ok) => this.getUserProfile(true),
          (error) => this.log.error(error)
        );
      },
      (error) => this.log.error(error)
    );
  }

  navigate(state) {
    if (state.startsWith('http'))
      window.open(state, '_blank');
    else
      this.router.navigate([state]);
  }

  getHelp() {
    if (this.router
      && this.router.routerState
      && this.router.routerState.root
      && this.router.routerState.root.firstChild)
      this.showHelp(this.router.routerState.root.firstChild);
  }

  showHelp(route:ActivatedRoute) {
    if (route
      && route.snapshot.data
      && route.snapshot.data.helpContext) {

      let helpContext: string = route.snapshot.data.helpContext;
      route.params.subscribe(
        (result) => {
          for(let param in result) {
            helpContext = helpContext.replace('${' + param + '}', result[param]);
          }
          window.open('https://wiki.discoverydataservice.org/index.php?title=' + (this.menuService.getApplicationTitle().replace(' ', '_')) + helpContext, 'Help');
        },
        (error) => this.log.error(error)
      );
    }
  }
}
