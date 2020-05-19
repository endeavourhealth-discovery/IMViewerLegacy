import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSearchComponent } from './concept-search.component';

describe('ConceptSearchComponent', () => {
  let component: ConceptSearchComponent;
  let fixture: ComponentFixture<ConceptSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSearchComponent ]
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
