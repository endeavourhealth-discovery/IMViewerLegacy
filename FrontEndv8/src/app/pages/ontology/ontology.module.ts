import { ConceptService } from '../../services/concept.service';
import { ComponentsModule } from '../../components/components.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import {OntologyLibraryComponent} from './ontology-library/ontology-library.component';
import {MatGridListModule} from '@angular/material/grid-list';
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
        MatTooltipModule,
        ComponentsModule,
        MatTabsModule,
        MatListModule,
        MatSidenavModule,
        NgJsonEditorModule,
        MatGridListModule,
        MonacoEditorModule
    ],
  declarations: [
    OntologyLibraryComponent,
  ]
})
export class OntologyModule { }
