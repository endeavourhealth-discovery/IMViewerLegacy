import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRecordLibraryComponent } from './health-record-library.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {ConceptService} from '../../../services/concept.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ComponentsModule} from '../../../components/components.module';
import {HealthRecordNavigatorService} from '../../../components/health-record-navigator/health-record-navigator.service';

describe('HealthRecordLibraryComponent', () => {
  let component: HealthRecordLibraryComponent;
  let fixture: ComponentFixture<HealthRecordLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRecordLibraryComponent ],
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

          HttpClientTestingModule,
          RouterTestingModule,
          ComponentsModule,
        ],
        providers: [
          { provide: HealthRecordNavigatorService, useClass: ConceptService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRecordLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
