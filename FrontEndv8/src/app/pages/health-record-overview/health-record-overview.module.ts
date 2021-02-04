import { ConceptService } from '../../services/concept.service';
import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormsModule} from '@angular/forms';
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
import { HealthRecordOverviewLibraryComponent } from './health-record-overview-library/health-record-overview-library.component';
import {HealthRecordOverviewRoutingModule} from './health-record-overview-routing.module';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatGridListModule,
        RouterModule,
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
        MatTooltipModule,
        ComponentsModule,
      HealthRecordOverviewRoutingModule
    ],

  declarations: [
    HealthRecordOverviewLibraryComponent
  ]
})
export class HealthRecordOverviewModule { }
