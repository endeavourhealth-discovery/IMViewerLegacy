import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSidebarSummaryComponent } from './concept-sidebar-summary.component';

describe('ConceptSidebarSummaryComponent', () => {
  let component: ConceptSidebarSummaryComponent;
  let fixture: ComponentFixture<ConceptSidebarSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSidebarSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSidebarSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
