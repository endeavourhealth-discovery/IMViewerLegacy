import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoggerModule} from 'dds-angular8/logger';
import {ConceptTreeViewComponent} from './concept-tree-view/concept-tree-view.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ConceptSearchComponent } from './concept-search/concept-search.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FlexModule} from '@angular/flex-layout';
import {GraphNavigatorComponent} from './graph-navigator/graph-navigator.component';
import { DataModelNavigatorComponent } from './data-model-navigator/data-model-navigator.component';
import {ResizeObserverDirective} from './resize-observer.directive';

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
    ConceptTreeViewComponent,
    ConceptSearchComponent,
    GraphNavigatorComponent,
    DataModelNavigatorComponent
  ],
  declarations: [
    ConceptTreeViewComponent,
    ConceptSearchComponent,
    GraphNavigatorComponent,
    DataModelNavigatorComponent,
    ResizeObserverDirective
  ]
})
export class ComponentsModule { }
