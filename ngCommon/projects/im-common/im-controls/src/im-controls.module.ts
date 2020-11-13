import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoggerModule} from 'dds-angular8/logger';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FlexModule} from '@angular/flex-layout';
import { DataModelNavigatorComponent } from './data-model-navigator/data-model-navigator.component';
import {ConceptTreeViewComponent} from './concept-tree-view/concept-tree-view.component';
import { NgEventBus } from 'ng-event-bus';

@NgModule({
    imports: [
        CommonModule,
        MatTreeModule,
        MatProgressBarModule,
        LoggerModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        FlexModule,
        ReactiveFormsModule,
    ],
    exports: [
        DataModelNavigatorComponent,
        ConceptTreeViewComponent
    ],
    declarations: [
        DataModelNavigatorComponent,
        ConceptTreeViewComponent
    ],
    providers: [
        NgEventBus,
    ]
})
export class IMControlsModule { }
