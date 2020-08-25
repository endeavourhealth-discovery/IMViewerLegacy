import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoggerModule} from 'dds-angular8/logger';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ConceptSearchComponent } from './concept-search/concept-search.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {FlexModule} from '@angular/flex-layout';
import {GraphNavigatorComponent} from './graph-navigator/graph-navigator.component';
import {ViewSwitcherComponent} from './view-switcher/view-switcher.component';
import {ResizeObserverDirective} from './resize-observer.directive';
import {MatSelectModule} from '@angular/material/select';
import {NavigationComponent} from './navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatProgressBarModule,
    MatCardModule,
    LoggerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    FlexModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    ConceptSearchComponent,
    GraphNavigatorComponent,
    ViewSwitcherComponent,
    NavigationComponent
  ],
  declarations: [
    ConceptSearchComponent,
    GraphNavigatorComponent,
    ViewSwitcherComponent,
    ResizeObserverDirective,
    NavigationComponent
  ]
})
export class ComponentsModule { }
