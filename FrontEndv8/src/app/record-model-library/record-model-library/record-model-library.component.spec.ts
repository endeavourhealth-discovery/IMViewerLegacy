import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordModelLibraryComponent } from './record-model-library.component';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularSplitModule} from 'angular-split';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {ControlsModule} from '../../mat-wrapper/controls.module';
import {RecordModelService} from '../record-model.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

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
          ControlsModule,

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
