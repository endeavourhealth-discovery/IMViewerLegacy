import { NgEventBus } from 'ng-event-bus';
// TODO: AppRoot to be extracted to common by splitting LayoutComponent

import {AfterViewInit, Component, ElementRef, HostBinding, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AbstractSecurityProvider} from './security/abstract-security-provider';
import {User} from './security/models/User';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {ConceptService} from './services/concept.service';
import {ConceptReference} from './models/objectmodel/ConceptReference';
import {FindConceptUsagesDialogComponent} from './components/find-concept-usages-dialog/find-concept-usages-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {LoggerService} from './services/logger.service';
import {Perspectives} from './services/perspective.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.html',
  styleUrls: ['./app-root.scss']
})
export class AppRoot implements OnInit, AfterViewInit {
  @HostBinding('class') componentCssClass = 'default-theme';
  @ViewChild('searchInput', {static: true}) input: ElementRef;
  @ViewChild('sidenav', {static: true}) sideNav: MatSidenav;

  user: User;
  menuItems: any[] = [];
  searchCall: Subscription = null;
  results: ConceptReference[]

  constructor(
    private log: LoggerService,
    private router: Router,
    public securityService: AbstractSecurityProvider,
    public perspectives: Perspectives,
    @Inject(DOCUMENT) private document: Document,
    public overlayContainer: OverlayContainer,
    public conceptService: ConceptService,
    private eventBus: NgEventBus,
    private dialog: MatDialog
  ) {
    this.eventBus.on('app:conceptSelect').subscribe((conceptIri: string) => {
      this.goto(conceptIri);
    });
  }

  ngOnInit() {
    this.securityService.secureRoutes();

    this.menuItems = this.perspectives.perspectives;

    this.securityService.secureMenuItems(this.menuItems);

    this.securityService.getUser().subscribe(
      (result) => this.user = result,
      (error) => this.log.error(error)
    )
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        map((e:any) => e.target.value),
        filter(v => v.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        tap((text) => {
          this.autoComplete(text)
        })
      )
      .subscribe();
  }

  autoComplete(term) {
    if (term == null || term == '')
      return;

    if (this.searchCall) {
      this.searchCall.unsubscribe();
      this.searchCall = null;
      this.results = [];
    }
    this.searchCall = this.conceptService.search(term)
      .subscribe(
        (result) => {
          this.results = result
          this.searchCall.unsubscribe();
          this.searchCall = null;
        },
        (error) => this.log.error(error)
      );
  }

  inspectConcept(concept: ConceptReference) {
    FindConceptUsagesDialogComponent.execute(this.dialog, concept).subscribe(
      () => {},
      (error) => this.log.error(error)
    )
  }

  logout() {
    this.securityService.logout();
  }

  onSetTheme(theme) {
    this.document.documentElement.classList.remove(this.componentCssClass);
    this.document.documentElement.classList.add(theme);
    // this.overlayContainer.getContainerElement().classList.remove(this.componentCssClass);
    // this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  showProfile() {
    this.securityService.goToProfile(this.user);
  }

  navigate(state) {
    this.sideNav.close();
    if (state.startsWith('http'))
      window.open(state, '_blank');
    else
      this.router.navigate([state]);
  }

  goto(iri: string) {
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { id: iri } });
  }

  search(evt: any) {

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
          window.open('https://wiki.discoverydataservice.org/index.php?title=Information_Model' + helpContext, 'Help');
        },
        (error) => this.log.error(error)
      );
    }
  }
}
