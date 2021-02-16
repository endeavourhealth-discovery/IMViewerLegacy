import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { EditConceptComponent } from '../components/edit-concept/edit-concept.component';
import { FindConceptUsagesDialogComponent } from '../components/find-concept-usages-dialog/find-concept-usages-dialog.component';
import { UserProfileDialog } from '../components/user-profile-dialog/user-profile-dialog.component';
import { ConceptReference } from '../models/objectmodel/ConceptReference';
import { User } from '../security/models/User';
import { SecurityService } from '../security/security.service';
import { ConceptService } from '../services/concept.service';
import { LoggerService } from '../services/logger.service';
import { Perspectives } from '../services/perspective.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @HostBinding('class') componentCssClass = 'default-theme';
  @ViewChild('sidenav', {static: true}) sideNav: MatSidenav;

  user: User;
  menuItems: any[] = [];
  searchCall: Subscription = null;
  results: ConceptReference[]

  constructor(
    private log: LoggerService,
    private router: Router,
    public securityService: SecurityService,
    public perspectives: Perspectives,
    @Inject(DOCUMENT) private document: Document,
    public conceptService: ConceptService,
    private eventBus: NgEventBus,
    private dialog: MatDialog
  ) {
    this.eventBus.on('app:conceptSelect').subscribe((conceptIri: string) => {
      this.goto(conceptIri);
    });
  }

  ngOnInit() {
    this.menuItems = this.perspectives.perspectives;

    this.securityService.getUser().subscribe(
      (result) => this.user = result,
      (error) => this.log.error(error)
    )
  }

  ngAfterViewInit() {
  }

  displayFn(concept: ConceptReference): string {
    return concept && concept.name ? concept.name : '';
  }

  logout() {
    this.securityService.logout();
  }

  onSetTheme(theme) {
    this.document.documentElement.classList.remove(this.componentCssClass);
    this.document.documentElement.classList.add(theme);
    this.componentCssClass = theme;
  }

  showProfile() {
    UserProfileDialog.execute(this.dialog, this.user)
  }

  navigate(state) {
    this.sideNav.close();
    if (state.startsWith('http'))
      window.open(state, '_blank');
    else
      this.router.navigate([state]);
  }

  goto(iri: string) {
    this.router.navigate([this.perspectives.current.primary.state, iri]);
  }

  openEditor() {
    this.dialog.open(EditConceptComponent, { width: '55%' });
  }

  getHelp() {
    if (this.router
      && this.router.routerState
      && this.router.routerState.root
      && this.router.routerState.root.firstChild)
      this.showHelp(this.router.routerState.root.firstChild);
  }

  getDisplayName() {
    if (this.user.forename && this.user.surname) return this.user.forename + ' ' + this.user.surname;
    return this.user.username;
  }

  showHelp(route:ActivatedRoute) {
    if (route
      && route.snapshot.firstChild
      && route.snapshot.firstChild.data
      && route.snapshot.firstChild.data.helpContext) {

      let helpContext: string = route.snapshot.firstChild.data.helpContext;
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
