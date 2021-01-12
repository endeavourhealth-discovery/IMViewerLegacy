import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSearchComponent } from './concept-search.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';

describe('ConceptSearchComponent', () => {
  let component: ConceptSearchComponent;
  let fixture: ComponentFixture<ConceptSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSearchComponent ],
      imports: [
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatInputModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
