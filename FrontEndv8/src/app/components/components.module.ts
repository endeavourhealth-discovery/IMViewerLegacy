import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { AngularSplitModule } from 'angular-split';
import { CookieService } from 'ngx-cookie-service';
import { CardHeaderComponent } from './card-header/card-header.component';
import { ConceptDefinitionComponent } from './concept-definition/concept-definition.component';
import { ConceptHierarchyViewComponent } from './concept-hierarchy-view/concept-hierarchy-view.component';
import { ConceptSearchResultComponent } from './concept-search-result/concept-search-result.component';
import { ConceptSearchComponent } from './concept-search/concept-search.component';
import { FindConceptUsagesDialogComponent } from './find-concept-usages-dialog/find-concept-usages-dialog.component';
import { GraphNavigatorComponent } from './graph-navigator/graph-navigator.component';
import { HealthRecordNavigatorComponent } from './health-record-navigator/health-record-navigator.component';
import { HealthRecordTabularViewComponent } from './health-record-tabular-view/health-record-tabular-view.component';
import { LibraryComponentComponent } from './library-component/library-component.component';
import { MatWrapperComponent } from './mat-wrapper/mat-wrapper.component';
import { QuickAccessComponent } from './quick-launch/quick-access.component';
import { ResizeObserverDirective } from './resize-observer.directive';
import { SideNavComponent } from './side-nav/side-nav.component';
import { SnomedLicenseDialog } from './snomed-license-dialog/snomed-license-dialog.component';
import { UserProfileDialog } from './user-profile-dialog/user-profile-dialog.component';
import { EditConceptComponent } from './edit-concept/edit-concept.component';
import { ViewMembersComponent } from './view-members/view-members.component';
import { ConceptLibraryComponent } from './concept-library/concept-library.component';
import { ConceptSummaryComponent } from './concept-summary/concept-summary.component';
import { ConceptSidebarSummaryComponent } from './concept-sidebar-summary/concept-sidebar-summary.component';


@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    FlexModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    AngularSplitModule,
    MatSnackBarModule,
    MatTabsModule,
    MatListModule,
    MatSidenavModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatDividerModule,
    MonacoEditorModule,
    NgJsonEditorModule
  ],
  declarations: [
    ConceptSearchComponent,
    ConceptSearchResultComponent,
    GraphNavigatorComponent,
    ResizeObserverDirective,
    CardHeaderComponent,
    HealthRecordTabularViewComponent,
    SideNavComponent,
    ConceptHierarchyViewComponent,
    FindConceptUsagesDialogComponent,
    ConceptDefinitionComponent,
    HealthRecordNavigatorComponent,
    LibraryComponentComponent,
    MatWrapperComponent,
    SnomedLicenseDialog,
    UserProfileDialog,
    QuickAccessComponent,
    EditConceptComponent,
    ViewMembersComponent,
    ConceptLibraryComponent,
    ConceptSummaryComponent,
    ConceptSidebarSummaryComponent,
  ],
  exports: [
    ConceptSearchComponent,
    ConceptSearchResultComponent,
    GraphNavigatorComponent,
    CardHeaderComponent,
    HealthRecordTabularViewComponent,
    SideNavComponent,
    ConceptDefinitionComponent,
    HealthRecordNavigatorComponent,
    LibraryComponentComponent,
    MatWrapperComponent,
    SnomedLicenseDialog,
    UserProfileDialog,
    QuickAccessComponent,
    EditConceptComponent,
    ViewMembersComponent,
    ConceptLibraryComponent,
  ],
  entryComponents: [
    FindConceptUsagesDialogComponent,
    SnomedLicenseDialog,
    UserProfileDialog
  ],
  providers: [
    CookieService
  ]
})
export class ComponentsModule { }
