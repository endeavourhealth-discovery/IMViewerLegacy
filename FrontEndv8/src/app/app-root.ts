import { NgEventBus } from 'ng-event-bus';
// TODO: AppRoot to be extracted to common by splitting LayoutComponent

import {Component, HostBinding, OnInit} from '@angular/core';
import {AbstractMenuProvider, LoggerService, MenuOption} from 'dds-angular8';
import {ActivatedRoute, Router} from '@angular/router';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AbstractSecurityProvider} from './security/abstract-security-provider';
import {User} from './security/models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.html',
  styleUrls: ['./app-root.scss']
})
export class AppRoot implements OnInit {
  @HostBinding('class') componentCssClass = 'default-theme';

  title = '';
  user: User;
  menuItems: MenuOption[] = [];

  constructor(
    private log: LoggerService,
    private router: Router,
    public securityService: AbstractSecurityProvider,
    public menuService: AbstractMenuProvider,
    public overlayContainer: OverlayContainer,
    private eventBus: NgEventBus
  ) {
    this.eventBus.on('app:conceptSelect').subscribe((conceptIri: string) => {
      this.goto(conceptIri);
    });
  }

  ngOnInit() {
    this.securityService.secureRoutes();

    this.title = this.menuService.getApplicationTitle();
    this.menuItems = this.menuService.getMenuOptions();

    this.securityService.secureMenuItems(this.menuItems);

    this.securityService.getUser().subscribe(
      (result) => this.user = result,
      (error) => this.log.error(error)
    )
  }

  logout() {
    this.securityService.logout();
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.remove(this.componentCssClass);
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  showProfile() {
    this.securityService.goToProfile(this.user);
  }

  navigate(state) {
    if (state.startsWith('http'))
      window.open(state, '_blank');
    else
      this.router.navigate([state]);
  }

  goto(iri: string) {
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { id: iri } });
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
