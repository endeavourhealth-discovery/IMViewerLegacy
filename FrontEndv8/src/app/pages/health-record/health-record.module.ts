import { NgJsonEditorModule } from 'ang-jsoneditor';
import { ConceptService } from '../../services/concept.service';
import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FlexModule} from '@angular/flex-layout';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HealthRecordLibraryComponent} from './health-record-library/health-record-library.component';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HealthRecordDialogComponent } from './health-record-create/health-record-dialog/health-record-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {HealthRecordNavigatorService} from '../../components/health-record-navigator/health-record-navigator.service';
import {MatMenuModule} from '@angular/material/menu';
import {HealthRecordRoutingModule} from './health-record-routing.module';
import {MonacoEditorModule} from 'ngx-monaco-editor';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    FlexModule,
    AngularSplitModule,
    MatTreeModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatInputModule,
    MatTooltipModule,
    ComponentsModule,
    MatTabsModule,
    MatListModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule,
    HealthRecordRoutingModule,
    MonacoEditorModule,
    NgJsonEditorModule
  ],
  providers: [
    { provide: HealthRecordNavigatorService, useClass: ConceptService }
  ],
  declarations: [
    HealthRecordLibraryComponent,
    HealthRecordDialogComponent
  ],
  entryComponents: [
    HealthRecordDialogComponent
  ]
})
export class HealthRecordModule { }
