import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularSplitModule } from 'angular-split';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConceptSearchComponent } from './concept-search/concept-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexModule } from '@angular/flex-layout';
import { GraphNavigatorComponent } from './graph-navigator/graph-navigator.component';
import { ResizeObserverDirective } from './resize-observer.directive';
import { MatSelectModule } from '@angular/material/select';
import { CardHeaderComponent } from './card-header/card-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HealthRecordTabularViewComponent } from './health-record-tabular-view/health-record-tabular-view.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ConceptHierarchyViewComponent } from './concept-hierarchy-view/concept-hierarchy-view.component';
import { FindConceptUsagesDialogComponent } from './find-concept-usages-dialog/find-concept-usages-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConceptDefinitionComponent } from './concept-definition/concept-definition.component';
import {HealthRecordNavigatorComponent} from './health-record-navigator/health-record-navigator.component';
import { LibraryComponentComponent } from './library-component/library-component.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatWrapperComponent} from './mat-wrapper/mat-wrapper.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SnomedLicenseDialog} from './snomed-license-dialog/snomed-license-dialog.component';
import { SummaryDrawerComponent } from './summary-drawer/summary-drawer.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {UserProfileDialog} from './user-profile-dialog/user-profile-dialog.component';


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
  ],
  declarations: [
    ConceptSearchComponent,
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
    SummaryDrawerComponent,
    UserProfileDialog,
  ],
  exports: [
    ConceptSearchComponent,
    GraphNavigatorComponent,
    CardHeaderComponent,
    HealthRecordTabularViewComponent,
    SideNavComponent,
    ConceptDefinitionComponent,
    HealthRecordNavigatorComponent,
    LibraryComponentComponent,
    MatWrapperComponent,
    SnomedLicenseDialog,
    SummaryDrawerComponent,
    UserProfileDialog
  ],
  entryComponents: [
    FindConceptUsagesDialogComponent,
    SnomedLicenseDialog,
    UserProfileDialog
  ]
})
export class ComponentsModule { }
