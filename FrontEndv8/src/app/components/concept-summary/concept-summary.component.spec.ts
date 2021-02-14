import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSummaryComponent } from './concept-summary.component';

describe('ConceptSummaryComponent', () => {
  let component: ConceptSummaryComponent;
  let fixture: ComponentFixture<ConceptSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
