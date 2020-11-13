import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyLibraryComponent } from './ontology-library.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {ControlsModule} from 'dds-angular8/controls';
import {ConceptService} from '../../services/concept.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoggerModule} from 'dds-angular8/logger';
import {IMControlsModule} from 'im-common';
import {ComponentsModule} from '../../components/components.module';
import {ConceptTreeViewService} from 'im-common/im-controls';

describe('OntologyLibraryComponent', () => {
  let component: OntologyLibraryComponent;
  let fixture: ComponentFixture<OntologyLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntologyLibraryComponent ],
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
          ComponentsModule
        ],
        providers: [
          { provide: ConceptTreeViewService, useClass: ConceptService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
