import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetLibraryComponent } from './value-set-library.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {ControlsModule} from 'dds-angular8/controls';
import {ConceptService} from '../../concept.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoggerModule} from 'dds-angular8/logger';
import {IMControlsModule} from 'im-common';
import {MatExpansionModule} from '@angular/material/expansion';
import {ComponentsModule} from '../../components/components.module';
import {MatDialogModule} from '@angular/material/dialog';
import {ConceptTreeViewService} from 'im-common/im-controls';

describe('ValueSetLibraryComponent', () => {
  let component: ValueSetLibraryComponent;
  let fixture: ComponentFixture<ValueSetLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetLibraryComponent ],
        imports: [
          MatCardModule,
          MatFormFieldModule,
          FormsModule,
          MatInputModule,
          AngularSplitModule,
          MatTreeModule,
          MatProgressBarModule,
          MatIconModule,
          MatSnackBarModule,
          ControlsModule,
          LoggerModule,

          HttpClientTestingModule,
          RouterTestingModule,
          IMControlsModule,
          ComponentsModule,
          MatExpansionModule,
          MatDialogModule
        ],
        providers: [
          { provide: ConceptTreeViewService, useClass: ConceptService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
