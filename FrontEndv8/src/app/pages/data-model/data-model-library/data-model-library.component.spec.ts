import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModelLibraryComponent } from './data-model-library.component';
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
import {ConceptTreeViewService} from '../../../components/concept-tree-view/concept-tree-view.service';
import {DataModelNavigatorService} from '../../../components/data-model-navigator/data-model-navigator.service';

describe('DataModelLibraryComponent', () => {
  let component: DataModelLibraryComponent;
  let fixture: ComponentFixture<DataModelLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataModelLibraryComponent ],
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
          { provide: ConceptTreeViewService, useClass: ConceptService },
          { provide: DataModelNavigatorService, useClass: ConceptService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataModelLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
