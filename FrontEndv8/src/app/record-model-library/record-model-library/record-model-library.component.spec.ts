import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordModelLibraryComponent } from './record-model-library.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {ControlsModule} from 'dds-angular8/controls';
import {RecordModelService} from '../record-model.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoggerModule} from 'dds-angular8/logger';

describe('RecordModelLibraryComponent', () => {
  let component: RecordModelLibraryComponent;
  let fixture: ComponentFixture<RecordModelLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordModelLibraryComponent ],
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
          RouterTestingModule
        ],
      providers: [RecordModelService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordModelLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
