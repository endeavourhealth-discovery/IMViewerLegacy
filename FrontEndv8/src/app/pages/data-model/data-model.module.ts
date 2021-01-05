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
import {DataModelLibraryComponent} from './data-model-library/data-model-library.component';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DataModelDialogComponent } from './data-model-create/data-model-dialog/data-model-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DataModelNavigatorService} from '../../components/data-model-navigator/data-model-navigator.service';
import {MatMenuModule} from '@angular/material/menu';
import {DataModelRoutingModule} from './data-model-routing.module';

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
    DataModelRoutingModule
  ],
  providers: [
    { provide: DataModelNavigatorService, useClass: ConceptService }
  ],
  declarations: [
    DataModelLibraryComponent,
    DataModelDialogComponent
  ],
  entryComponents: [
    DataModelDialogComponent
  ]
})
export class DataModelModule { }
