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
import {ControlsModule} from 'dds-angular8/controls';
import {LoggerModule} from 'dds-angular8/logger';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ComponentsModule} from '../components/components.module';
import {IMControlsModule} from 'im-common';
import {ConceptTreeViewService, DataModelNavigatorService} from 'im-common/im-controls';
import {ConceptService} from '../services/concept.service';
import { DataModelOverviewLibraryComponent } from './data-model-overview-library/data-model-overview-library.component';

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
        ControlsModule,
        LoggerModule,
        MatTooltipModule,
        ComponentsModule,
        IMControlsModule
    ],
  providers: [
    { provide: ConceptTreeViewService, useClass: ConceptService }
  ],
  declarations: [
    DataModelOverviewLibraryComponent
  ]
})
export class DataModelOverviewModule { }
